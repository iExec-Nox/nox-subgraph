import { Bytes } from '@graphprotocol/graph-ts';
import {
    Allowed as AllowedEvent,
    MarkedAsPubliclyDecryptable as MarkedAsPubliclyDecryptableEvent,
    ViewerAdded as ViewerAddedEvent,
} from '../generated/ACL/ACL';
import {
    Allowed,
    Handle,
    HandleRole,
    MarkedAsPubliclyDecryptable,
    ViewerAdded,
} from '../generated/schema';

function getOrCreateHandle(handleId: Bytes): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
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
    const role = new HandleRole(event.transaction.hash.concatI32(event.logIndex.toI32()));
    role.handle = handle.id;
    role.account = event.params.account;
    role.role = 'ADMIN';
    role.grantedBy = event.params.sender;
    role.blockNumber = event.block.number;
    role.blockTimestamp = event.block.timestamp;
    role.transactionHash = event.transaction.hash;
    role.save();
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
    handle.isPubliclyDecryptable = true;
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

    // Create a HandleRole for the viewer
    const roleId = event.transaction.hash.concatI32(event.logIndex.toI32());
    const role = new HandleRole(roleId);
    role.handle = handle.id;
    role.account = event.params.viewer;
    role.role = 'VIEWER';
    role.grantedBy = event.params.sender;
    role.blockNumber = event.block.number;
    role.blockTimestamp = event.block.timestamp;
    role.transactionHash = event.transaction.hash;
    role.save();

    handle.save();
}
