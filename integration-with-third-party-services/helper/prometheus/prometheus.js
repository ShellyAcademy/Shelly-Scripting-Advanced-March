/*
 * This script exposes a "/status" endpoint that returns Prometheus metrics that can be scraped.
 * It will be reachable under "<ip>/script/<id>/metrics". Id will be 1 if this is your first script.
 *
 * Example Prometheus config:
 *
 * scrape_configs:
 *   - job_name: 'shelly'
 *     metrics_path: /script/1/metrics
 *     static_configs:
 *       - targets: ['<ip>']
 *
 * Replace <ip> with the ip address of the device and adjust the script id if needed.
 *
 * If you use Grafana to display metrics scraped, you can give a try to the example dashboard in prometheus-grafana-example-dashboard.json
 * available via the url https://raw.githubusercontent.com/ALLTERCO/shelly-script-examples/main/prometheus-grafana-example-dashboard.json
 *
 * Note: This script assumes you have one switch, but you can configure that in the Configuration section
 */
// ---------------------------------------------------------------------------------------------------------------------
// Configuration (you can change / adapt here)
// ---------------------------------------------------------------------------------------------------------------------

// Prefix added to all metrics name
const metric_prefix = "shelly_"
// url of metrics. will be used for the last part of "<ip>/script/<id>/<url>"
//    where ip = your plug ip/hostname; id the script id or number (1 if this is the first); url the value below
const url = "metrics"

// List of internal switch to monitor using the shelly's id naming scheme in the form of switch:<id> (ex switch:0)
const monitored_switches = ["switch:0"]
const monitored_inputs = ["input:100"]
const monitored_temperature = ["temperature:100"]
const monitored_voltmeter = []

// ---------------------------------------------------------------------------------------------------------------------
// Prometheus exporter
// ---------------------------------------------------------------------------------------------------------------------

const TYPE_GAUGE = "gauge"
const TYPE_COUNTER = "counter"

var info = Shelly.getDeviceInfo();

function promLabel(label, value) {
  return [label, "=", '"', value, '"'].join("");
}

// Will be added to every metrics
var defaultLabels = [
  ["name", info.name],
  ["id", info.id],
  ["mac", info.mac],
  ["app", info.app]
]
  .map(function (data) {
    return promLabel(data[0], data[1]);
  });

/**
 *  Generate one metric output with all the shenanigans around it
 * @param name The name of the metrics (Will be prefixed by metric_prefix value)
 * @param type One of the TYPE_* of metrics. Usually Counter, Gauge, Histogram (not supported yes)
 * @param specificLabels Array of labels generated by promLabel() specific to this metric.
 * @param description An Human description of the metric
 * @param value The actual metric numeric value
 * @returns {string} The metric string to include in final response
 */
function printPrometheusMetric(name, type, specificLabels, description, value) {
  return [
    "# HELP ", metric_prefix, name, " ", description, "\n",
    "# HELP ", metric_prefix, name, " ", type, "\n",
    metric_prefix, name, "{", defaultLabels.join(","), specificLabels.length > 0 ? "," : "", specificLabels.join(","), "}", " ", value, "\n\n"
  ].join("");
}

/**
 * HTTP handler that will be called when the url will be accessed
 * @param request
 * @param response
 */
function httpServerHandler(request, response) {
  response.body = [
    generateMetricsForSystem(),
    monitored_switches.map(function (switch_string_id) {
      return generateMetricsForSwitch(switch_string_id)
    }).join(""),
    monitored_inputs.map(function (string_id) {
      return generateMetricsForInput(string_id)
    }).join(""),
    monitored_temperature.map(function (string_id) {
      return generateMetricsForTemperature(string_id)
    }).join(""),
    monitored_voltmeter.map(function (string_id) {
      return generateMetricsForVoltmeter(string_id)
    }).join("")
  ].join("")
  response.code = 200;
  response.send();
}

/**
 * Generate metrics for the system part
 * @returns {string}
 */
function generateMetricsForSystem() {
  const sys = Shelly.getComponentStatus("sys")
  return [
    printPrometheusMetric("uptime_seconds", TYPE_COUNTER, [], "upime in s", sys.uptime),
    printPrometheusMetric("ram_size_bytes", TYPE_GAUGE, [], "RAM size in bytes", sys.ram_size),
    printPrometheusMetric("ram_free_bytes", TYPE_GAUGE, [], "Free RAM size in bytes", sys.ram_free)
  ].join("")
}

/**
 * generate metrics for one switch with the name given as parameter
 * @returns {string}
 */
function generateMetricsForSwitch(string_id) {
  const sw = Shelly.getComponentStatus(string_id);
  return [
    printPrometheusMetric("switch_power_watts", TYPE_GAUGE, [promLabel("switch", sw.id)], "Instant power consumption in W", sw.apower),
    printPrometheusMetric("switch_voltage_volts", TYPE_GAUGE, [promLabel("switch", sw.id)], "Instant voltage in V", sw.voltage),
    printPrometheusMetric("switch_current_amperes", TYPE_GAUGE, [promLabel("switch", sw.id)], "Instant current in A", sw.current),
    printPrometheusMetric("switch_temperature_celsius", TYPE_GAUGE, [promLabel("switch", sw.id)], "temperature of the device in C", sw.temperature.tC),
    printPrometheusMetric("switch_power_total", TYPE_COUNTER, [promLabel("switch", sw.id)], "accumulated energy consumed in Wh", sw.aenergy.total),
    printPrometheusMetric("switch_output", TYPE_GAUGE, [promLabel("switch", sw.id)], "is switch (1)on or (0)off", sw.output ? 1 : 0)
  ].join("");
}

/**
 * generate metrics for one input with the name given as parameter
 * @returns {string}
 */
function generateMetricsForInput(string_id) {
  const conf = Shelly.getComponentConfig(string_id);
  const st = Shelly.getComponentStatus(string_id);
  
  const input_type = conf.type==="switch"?0:conf.type==="button"?1:conf.type==="analog"?3:-1;
  
  if (conf.type === "analog") {
    return [
      printPrometheusMetric("input_type", TYPE_COUNTER, [promLabel("input", st.id)], "Input type", input_type),
      printPrometheusMetric("input_percent", TYPE_GAUGE, [promLabel("input", st.id)], "Analog input in percent", st.percent),
    ].join("");
  } else if (conf.type === "switch" || conf.type === "button") {
    return [
      printPrometheusMetric("input_type", TYPE_COUNTER, [promLabel("input", st.id)], "Input type", input_type),
      printPrometheusMetric("input_state", TYPE_COUNTER, [promLabel("input", st.id)], "Input state", st.state?1:0)
    ].join("");
  }
}

function generateMetricsForTemperature(string_id) {
  const conf = Shelly.getComponentConfig(string_id);
  const st = Shelly.getComponentStatus(string_id);
  return [
    printPrometheusMetric("temp_celsius", TYPE_GAUGE, [promLabel("temperature", st.id)], "Temperature reading in celsius", st.tC),
  ].join("");
}

function generateMetricsForVoltmeter(string_id) {
  const conf = Shelly.getComponentConfig(string_id);
  const st = Shelly.getComponentStatus(string_id);
  return [
    printPrometheusMetric("voltmeter_voltage", TYPE_GAUGE, [promLabel("voltmeter", st.id)], "Voltage reading", st.voltage)
  ].join("");
}

HTTPServer.registerEndpoint(url, httpServerHandler);
