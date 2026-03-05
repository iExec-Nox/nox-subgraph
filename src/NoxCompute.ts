import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
    Allowed as AllowedEvent,
    MarkedAsPubliclyDecryptable as MarkedAsPubliclyDecryptableEvent,
    ViewerAdded as ViewerAddedEvent,
} from '../generated/NoxCompute/NoxCompute';
import { Handle, HandleRole } from '../generated/schema';

function getOrCreateHandle(handleId: Bytes): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
        handle.save();
    }
    return handle;
}

function createRole(
    handle: Handle,
    account: Bytes,
    role: string,
    grantedBy: Bytes,
    txHash: Bytes,
    logIndex: i32,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
): void {
    const roleId = txHash.concatI32(logIndex);
    const handleRole = new HandleRole(roleId);
    handleRole.handle = handle.id;
    handleRole.account = account;
    handleRole.role = role;
    handleRole.grantedBy = grantedBy;
    handleRole.blockNumber = blockNumber;
    handleRole.blockTimestamp = blockTimestamp;
    handleRole.transactionHash = txHash;
    handleRole.save();
}

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
