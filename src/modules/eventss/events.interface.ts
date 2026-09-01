import { EventStatus } from './../../../prisma/generated/prisma/enums';

export interface IEvent {
    title: string;
    description?: string;
    status?: EventStatus;
    location?: string;
    approvedBy?: string;
}