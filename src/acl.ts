import {
    Allowed as AllowedEvent,
    Initialized as InitializedEvent,
    MarkedAsPubliclyDecryptable as MarkedAsPubliclyDecryptableEvent,
    NoxComputeUpdated as NoxComputeUpdatedEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Upgraded as UpgradedEvent,
    ViewerAdded as ViewerAddedEvent,
} from '../generated/ACL/ACL';
import {
    Allowed,
    Initialized,
    MarkedAsPubliclyDecryptable,
    NoxComputeUpdated,
    OwnershipTransferred,
    Upgraded,
    ViewerAdded,
} from '../generated/schema';

export function handleAllowed(event: AllowedEvent): void {
    const entity = new Allowed(event.transaction.hash.concatI32(event.logIndex.toI32()));
    entity.sender = event.params.sender;
    entity.account = event.params.account;
    entity.handle = event.params.handle;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
    const entity = new Initialized(event.transaction.hash.concatI32(event.logIndex.toI32()));
    entity.version = event.params.version;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
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
}

export function handleNoxComputeUpdated(event: NoxComputeUpdatedEvent): void {
    const entity = new NoxComputeUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()));
    entity.newNoxCompute = event.params.newNoxCompute;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
    const entity = new OwnershipTransferred(
        event.transaction.hash.concatI32(event.logIndex.toI32()),
    );
    entity.previousOwner = event.params.previousOwner;
    entity.newOwner = event.params.newOwner;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleUpgraded(event: UpgradedEvent): void {
    const entity = new Upgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
    entity.implementation = event.params.implementation;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
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
}
