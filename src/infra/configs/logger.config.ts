/* eslint-disable */
import type { Params } from "nestjs-pino";
import fs from "node:fs";
import type { IncomingMessage } from "node:http";
import os from "node:os";
import path from "node:path";
import pino from "pino";
import pretty from "pino-pretty";
import { v7 } from "uuid";

export default {
  pinoHttp: {
    level: process.env.NODE_ENV === "test" ? "silent" : process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    genReqId: (req: IncomingMessage) => req.headers["x_trace_id"] ?? v7(),
    autoLogging: false,
    serializers: {
      req: req => ({
        requestId: req.id,
        method: req.method,
        url: req.url,
        ip: req.remoteAddress || req.headers["x-forwarded-for"],
        userAgent: req.headers["user-agent"],
        contentType: req.headers["content-type"],
      }),
      res: res => ({ statusCode: res.statusCode, contentType: res.contentType || res.headers["content-type"] }),
      err: err => ({
        statusCode: err.statusCode,
        name: err.name,
        message: err.message,
        details: err.details,
        stack: err.stack,
      }),
    },
    customAttributeKeys: { req: "request", res: "response", err: "error" },
    customSuccessMessage: () => `Resposta com sucesso.`,
    formatters: {
      bindings: bindings => {
        return {
          pid: bindings["pid"],
          hostname: bindings["hostname"],
          node_version: process.version,
          stage: process.env.NODE_ENV,
        };
      },
      level: label => {
        return { level: label.toUpperCase() };
      },
    },
    redact: {
      paths: [
        "[*].authorization",
        "[*][*].authorization",
        "[*].cookie",
        "[*][*].cookie",
        "[*].password",
        "[*][*].password",
        "[*].document",
        "[*][*].document",
        "[*].email",
        "[*][*].email",
        "[*].phone",
        "[*][*].phone",
        "[*].pass",
        "[*][*].pass",
        "[*].token",
        "[*][*].token",
        "[*].access_token",
        "[*][*].access_token",
        "[*].accessToken",
        "[*][*].accessToken",
        "[*].refresh_token",
        "[*][*].refresh_token",
        "[*].refreshToken",
        "[*][*].refreshToken",
      ],
      censor: (value, path) => {
        if (path.includes("details")) return value;
        return "[redact]";
      },
    },
    stream: pino.multistream([
      { stream: pretty({ ignore: "bun_version,stage", sync: true }) },
      {
        stream: fs.createWriteStream(path.join(os.tmpdir(), "protocol_search_api.log"), {
          flags: "a",
          encoding: "utf8",
          mode: 0o644,
        }),
      },
    ]),
  },
} satisfies Params;
