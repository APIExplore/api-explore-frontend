import { NotificationProps } from "@tiller-ds/alert";
import { Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

export function renderEditSequenceNotification(sequenceName: string) {
  return {
    title: "Editing Sequence",
    content: (
      <Typography className="text-body-light">
        You are now editing sequence <i>{sequenceName}</i>
      </Typography>
    ),
    icon: (
      <Icon
        type="pencil-circle"
        className="text-green-600 opacity-60"
        size={7}
      />
    ),
  } as NotificationProps;
}

export function renderRemoveSequenceNotification(sequenceName: string) {
  return {
    title: "Sequence Removed",
    content: (
      <Typography className="text-body-light">
        You have removed the sequence <i>{sequenceName}</i>
      </Typography>
    ),
    icon: (
      <Icon type="x-circle" className="text-danger-600 opacity-60" size={7} />
    ),
  } as NotificationProps;
}

export function renderRemoveSchemaNotification(schemaName: string) {
  return {
    title: "Schema Removed",
    content: (
      <Typography className="text-body-light">
        You have removed the schema <i>{schemaName}</i>
      </Typography>
    ),
    icon: (
      <Icon type="x-circle" className="text-danger-600 opacity-60" size={7} />
    ),
  } as NotificationProps;
}

export function renderChooseSchemaNotification(schemaName: string) {
  return {
    title: "Schema Selected",
    content: (
      <Typography className="text-body-light">
        You are working with the schema <i>{schemaName}</i>
      </Typography>
    ),
    icon: (
      <Icon type="file-text" className="text-primary opacity-60" size={7} />
    ),
  } as NotificationProps;
}

export function renderSimulationStartedNotification() {
  return {
    title: "Simulation started",
    closeButton: false,
    timeout: 2000,
    content: (
      <Typography className="text-body-light">
        You can view the logs in the logs tab
      </Typography>
    ),
    icon: (
      <span className="animate-pulse">
        <Icon type="file-text" className="text-primary opacity-60" size={7} />
      </span>
    ),
  } as NotificationProps;
}
