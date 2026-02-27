import { Bytes } from '@graphprotocol/graph-ts';
import {
    Allowed as AllowedEvent,
    MarkedAsPubliclyDecryptable as MarkedAsPubliclyDecryptableEvent,
    ViewerAdded as ViewerAddedEvent,
} from '../generated/ACL/ACL';
import { Allowed, Handle, MarkedAsPubliclyDecryptable, ViewerAdded } from '../generated/schema';

function getOrCreateHandle(handleId: Bytes): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPublic = false;
        handle.viewers = [];
        handle.allowedAccounts = [];
    }
    return handle;
}

export function handleAllowed(event: AllowedEvent): void {
    const entity = new Allowed(event.transaction.hash.concatI32(event.logIndex.toI32()));
    entity.sender = event.params.sender;
    entity.account = event.params.account;
    entity.handle = event.params.handle;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();

    const handle = getOrCreateHandle(event.params.handle);
    const account = event.params.account;

    if (!handle.allowedAccounts.includes(account)) {
        const allowedAccounts = handle.allowedAccounts;
        allowedAccounts.push(account);
        handle.allowedAccounts = allowedAccounts;
    }

    handle.blockNumber = event.block.number;
    handle.blockTimestamp = event.block.timestamp;
    handle.transactionHash = event.transaction.hash;
    handle.save();
}

export function handleMarkedAsPubliclyDecryptable(event: MarkedAsPubliclyDecryptableEvent): void {
    const entity = new MarkedAsPubliclyDecryptable(
        event.transaction.hash.concatI32(event.logIndex.toI32()),
    );
    entity.sender = event.params.sender;
    entity.handle = event.params.handle;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();

    const handle = getOrCreateHandle(event.params.handle);
    handle.isPublic = true;
    handle.blockNumber = event.block.number;
    handle.blockTimestamp = event.block.timestamp;
    handle.transactionHash = event.transaction.hash;
    handle.save();
}

export function handleViewerAdded(event: ViewerAddedEvent): void {
    const entity = new ViewerAdded(event.transaction.hash.concatI32(event.logIndex.toI32()));
    entity.sender = event.params.sender;
    entity.viewer = event.params.viewer;
    entity.handle = event.params.handle;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.save();

    const handle = getOrCreateHandle(event.params.handle);
    const viewer = event.params.viewer;

    if (!handle.viewers.includes(viewer)) {
        const viewers = handle.viewers;
        viewers.push(viewer);
        handle.viewers = viewers;
    }

    handle.blockNumber = event.block.number;
    handle.blockTimestamp = event.block.timestamp;
    handle.transactionHash = event.transaction.hash;
    handle.save();
}
