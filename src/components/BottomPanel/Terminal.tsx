import React, { useEffect, useRef, useState } from "react";

import { Badge, IconButton, Typography } from "@tiller-ds/core";
import { Toggle } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import useLogsStore, { LogError, LogWarning } from "../../stores/logsStore";
import { prettifyTimestamp } from "../../util/dateUtils";

export default function Terminal() {
  const errors = useLogsStore((store) => store.errors);
  const warnings = useLogsStore((store) => store.warnings);

  const clearWarnings = useLogsStore((store) => store.clearWarnings);
  const clearErrors = useLogsStore((store) => store.clearErrors);
  const clearAllLogs = useLogsStore((store) => store.clearAllLogs);

  const terminalRef = useRef<HTMLDivElement>(null);
  const [categorized, setCategorized] = useState<boolean>(false);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [errors, warnings]);

  return (
    <div className="bg-slate-900 h-full overflow-y-hidden">
      <div className="overflow-hidden relative text-gray-300 h-full">
        {categorized && (
          <div className="absolute left-1/2 -ml-1 w-[2px] h-full bg-slate-600 z-50 rounded-full" />
        )}
        <div className="sticky w-full h-[42px] bg-slate-800 z-40 shadow-sm shadow-slate-600">
          {categorized ? (
            <>
              <div className="absolute flex items-center space-x-2 left-2 top-1.5 w-full z-40 ">
                <Badge
                  variant="outlined"
                  color="warning"
                  className="justify-center bg-warning-300 w-fit"
                >
                  Warnings
                </Badge>
                <IconButton
                  icon={<Icon type="eraser" />}
                  onClick={clearWarnings}
                  label="Clear Warnings"
                  disabled={warnings.length === 0}
                />
              </div>
              <div className="absolute flex items-center space-x-2 left-1/2 top-1.5 pl-2 z-40">
                <Badge
                  variant="outlined"
                  color="danger"
                  className="justify-center bg-danger-300 w-fit"
                >
                  Errors
                </Badge>
                <IconButton
                  icon={<Icon type="eraser" />}
                  onClick={clearErrors}
                  label="Clear Errors"
                  disabled={errors.length === 0}
                />
              </div>
            </>
          ) : (
            <div className="absolute flex items-center space-x-2 left-2 top-1.5 w-full z-40 ">
              <Badge
                variant="outlined"
                color="info"
                className="justify-center bg-info-100 w-fit"
              >
                Logs
              </Badge>
              <IconButton
                icon={<Icon type="eraser" />}
                onClick={clearAllLogs}
                label="Clear All Logs"
                disabled={warnings.length === 0 && errors.length === 0}
              />
            </div>
          )}
          <Toggle
            label={
              <span className="text-sm text-white leading-5 font-medium">
                Categorized
              </span>
            }
            reverse={true}
            checked={categorized}
            onClick={() => setCategorized(!categorized)}
            tokens={{
              gray: "bg-black",
              toggle:
                "inline-block h-5 w-5 rounded-full bg-slate-100 shadow transform transition ease-in-out duration-200 flex align-center toggle-favorite",
              base: "w-11 h-6 relative inline-flex rounded-full border-2 border-transparent shrink-0 cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring focus:ring-primary-dark",
            }}
            className="absolute right-4 top-1.5 z-50 text-slate-800"
          />
        </div>
        <div
          className="flex w-full h-4/5 absolute left-0 overflow-y-auto scrollbar"
          ref={terminalRef}
        >
          {categorized ? (
            <>
              <div className="flex flex-col w-1/2 pl-2">
                {warnings.map((warning: LogWarning, index: number) => (
                  <div key={`warning-${index}`} className="last:pb-1">
                    <Typography variant="subtitle" className="text-warning">
                      [Warning]
                    </Typography>{" "}
                    <Typography variant="subtitle" className="text-yellow-500">
                      {prettifyTimestamp(warning.timestamp, false)}{" "}
                      {warning.warning}
                    </Typography>
                  </div>
                ))}
              </div>
              <div className="flex flex-col w-1/2 pl-2">
                {errors.map((error: LogError, index: number) => (
                  <div key={`error-${index}`} className="last:pb-1">
                    <Typography variant="subtitle" className="text-danger">
                      [Error]
                    </Typography>{" "}
                    <Typography variant="subtitle" className="text-red-500">
                      {prettifyTimestamp(error.timestamp, false)} {error.error}
                    </Typography>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col w-1/2 pl-2">
              {[...warnings, ...errors]
                .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
                .map((log: LogError | LogWarning, index: number) => (
                  <div key={`error-${index}`} className="last:pb-1">
                    <Typography
                      variant="subtitle"
                      className={
                        "warning" in log ? "text-warning" : "text-danger"
                      }
                    >
                      [{"warning" in log ? "Warning" : "Error"}]
                    </Typography>{" "}
                    <Typography
                      variant="subtitle"
                      className={
                        "warning" in log ? "text-yellow-500" : "text-red-500"
                      }
                    >
                      {prettifyTimestamp(log.timestamp, false)}{" "}
                      {"warning" in log ? log.warning : log.error}
                    </Typography>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
