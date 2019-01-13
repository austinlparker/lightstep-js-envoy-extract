"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opentracing = require("opentracing");
var pb = require("protobufjs");
var jsonDescriptor = require("./basicTracerCarrier.json");
var EnvoyPropagator = /** @class */ (function () {
    function EnvoyPropagator() {
        this.carrierPB = pb.Root.fromJSON(jsonDescriptor);
    }
    EnvoyPropagator.prototype.Extract = function (format, carrier) {
        switch (format) {
            case opentracing.FORMAT_BINARY: {
                var binaryData = Buffer.from(carrier, 'base64');
                var binaryCarrier = this.carrierPB.lookupType("BasicTracerCarrier");
                var msg = binaryCarrier.decode(binaryData);
                return {
                    trace_id: msg["trace_id"],
                    span_id: msg["span_id"]
                };
            }
            default: {
                console.error("not binary format!");
            }
        }
    };
    return EnvoyPropagator;
}());
exports.default = EnvoyPropagator;
