import { AlertPriority, AlertType, CampusAlertStatus } from "../../../prisma/generated/prisma/enums";

export interface IAlertCreatePayload {
  title: unknown;
  message: unknown;
  alertType?: unknown;
  priority?: unknown;
  status?: unknown;
  date?: unknown;
}

export interface IAlertUpdatePayload {
  title?: unknown;
  message?: unknown;
  alertType?: unknown;
  priority?: unknown;
  status?: unknown;
  date?: unknown;
}

export interface IValidatedAlert {
  title: string;
  message: string;
  alertType: AlertType;
  priority: AlertPriority;
  status: CampusAlertStatus;
  date: Date;
}

export const validateCreateAlert = (payload: IAlertCreatePayload): IValidatedAlert => {
  const { title, message, alertType, priority, status, date } = payload;

  if (!title || typeof title !== "string") throw new Error("Title is required");
  if (!message || typeof message !== "string") throw new Error("Message is required");

  const validTypes = Object.values(AlertType);
  const validPriorities = Object.values(AlertPriority);
  const validStatuses = Object.values(CampusAlertStatus);

  return {
    title: title.trim(),
    message: message.trim(),
    alertType:
      typeof alertType === "string" && validTypes.includes(alertType as AlertType)
        ? (alertType as AlertType)
        : AlertType.GENERAL,
    priority:
      typeof priority === "string" && validPriorities.includes(priority as AlertPriority)
        ? (priority as AlertPriority)
        : AlertPriority.MEDIUM,
    status:
      typeof status === "string" && validStatuses.includes(status as CampusAlertStatus)
        ? (status as CampusAlertStatus)
        : CampusAlertStatus.ACTIVE,
    date: date && !isNaN(new Date(date as string).getTime()) ? new Date(date as string) : new Date(),
  };
};

export const validateUpdateAlert = (payload: IAlertUpdatePayload): Partial<IValidatedAlert> => {
  const data: Partial<IValidatedAlert> = {};
  const validTypes = Object.values(AlertType);
  const validPriorities = Object.values(AlertPriority);
  const validStatuses = Object.values(CampusAlertStatus);

  if (payload.title !== undefined) {
    if (!payload.title || typeof payload.title !== "string") throw new Error("Valid title is required");
    data.title = payload.title.trim();
  }
  if (payload.message !== undefined) {
    if (!payload.message || typeof payload.message !== "string") throw new Error("Valid message is required");
    data.message = payload.message.trim();
  }
  if (payload.alertType !== undefined && typeof payload.alertType === "string" && validTypes.includes(payload.alertType as AlertType)) {
    data.alertType = payload.alertType as AlertType;
  }
  if (payload.priority !== undefined && typeof payload.priority === "string" && validPriorities.includes(payload.priority as AlertPriority)) {
    data.priority = payload.priority as AlertPriority;
  }
  if (payload.status !== undefined && typeof payload.status === "string" && validStatuses.includes(payload.status as CampusAlertStatus)) {
    data.status = payload.status as CampusAlertStatus;
  }
  if (payload.date !== undefined) {
    if (payload.date && !isNaN(new Date(payload.date as string).getTime())) {
      data.date = new Date(payload.date as string);
    }
  }

  return data;
};
