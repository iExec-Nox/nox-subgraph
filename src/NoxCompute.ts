import {
    Allowed as AllowedEvent,
    MarkedAsPubliclyDecryptable as MarkedAsPubliclyDecryptableEvent,
    ViewerAdded as ViewerAddedEvent,
} from '../generated/NoxCompute/NoxCompute';
import { createRole, getOrCreateHandle } from './utils/utils';

export function handleAllowed(event: AllowedEvent): void {
    const handle = getOrCreateHandle(event.params.handle);
    createRole(
        handle,
        event.params.account,
        'ADMIN',
        event.params.sender,
        event.transaction.hash,
        event.logIndex.toI32(),
        event.block.number,
        event.block.timestamp,
    );
    handle.save();
}

export function handleMarkedAsPubliclyDecryptable(event: MarkedAsPubliclyDecryptableEvent): void {
    const handle = getOrCreateHandle(event.params.handle);
    handle.isPubliclyDecryptable = true;
    handle.save();
}

export function handleViewerAdded(event: ViewerAddedEvent): void {
    const handle = getOrCreateHandle(event.params.handle);
    createRole(
        handle,
        event.params.viewer,
        'VIEWER',
        event.params.sender,
        event.transaction.hash,
        event.logIndex.toI32(),
        event.block.number,
        event.block.timestamp,
    );
    handle.save();
}
