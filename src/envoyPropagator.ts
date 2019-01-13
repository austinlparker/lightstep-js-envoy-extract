import * as opentracing from 'opentracing';
import * as pb from 'protobufjs';
const jsonDescriptor = require("./basicTracerCarrier.json");
declare const Buffer

export default class EnvoyPropagator {
    carrierPB: pb.Root
    constructor() {
        this.carrierPB = pb.Root.fromJSON(jsonDescriptor)
    }
    
    Extract(format: any, carrier: any) {
        switch (format) {
            case opentracing.FORMAT_BINARY: {
                const binaryData = Buffer.from(carrier, 'base64')
                let binaryCarrier = this.carrierPB.lookupType("BasicTracerCarrier")
                let msg = binaryCarrier.decode(binaryData)
                return {
                    trace_id: msg["trace_id"],
                    span_id: msg["span_id"]
                }
            }
            default: {
                console.error("not binary format!")
            }
        }
    }
}