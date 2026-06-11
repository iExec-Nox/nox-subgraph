import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Handle, HandleRole } from '../../generated/schema';

export function getOrCreateHandle(
    handleId: Bytes,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
    txHash: Bytes,
): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
        // Handle is being created as a side-effect (ACL event, or operand
        // discovered by a child operation). There is no "creation tx" for
        // handles created through the gateway, so we record the discovering
        // tx to ensure downstream consumers get a non-null transactionHash.
        handle.operator = '';
        handle.parentHandles = new Array<Bytes>(0);
        handle.childHandles = new Array<Bytes>(0);
        handle.blockNumber = blockNumber;
        handle.blockTimestamp = blockTimestamp;
        handle.transactionHash = txHash;
        handle.save();
    }
    return handle;
}

export function createOperation(
    operator: string,
    operandIds: Bytes[],
    outputIds: Bytes[],
    txHash: Bytes,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
): void {
    for (let i = 0; i < operandIds.length; i++) {
        getOrCreateHandle(operandIds[i], blockNumber, blockTimestamp, txHash);
    }

    for (let i = 0; i < outputIds.length; i++) {
        let output = Handle.load(outputIds[i]);
        if (output == null) {
            output = new Handle(outputIds[i]);
            output.isPubliclyDecryptable = false;
            output.childHandles = new Array<Bytes>(0);
        }
        output.operator = operator;
        output.parentHandles = operandIds;
        output.transactionHash = txHash;
        output.blockNumber = blockNumber;
        output.blockTimestamp = blockTimestamp;
        output.save();
    }

    for (let i = 0; i < operandIds.length; i++) {
        let parent = Handle.load(operandIds[i]);
        if (parent != null) {
            let children = parent.childHandles;
            for (let j = 0; j < outputIds.length; j++) {
                children.push(outputIds[j]);
            }
            parent.childHandles = children;
            parent.save();
        }
    }
}

export function createWrapAsPublicHandleOperation(
    plaintext: Bytes,
    outputIds: Bytes[],
    txHash: Bytes,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
): void {
    for (let i = 0; i < outputIds.length; i++) {
        let output = Handle.load(outputIds[i]);
        if (output == null) {
            output = new Handle(outputIds[i]);
            output.isPubliclyDecryptable = false;
            output.childHandles = new Array<Bytes>(0);
        }
        output.operator = 'WrapAsPublicHandle';
        output.parentHandles = new Array<Bytes>(0);
        output.plaintext = plaintext;
        output.transactionHash = txHash;
        output.blockNumber = blockNumber;
        output.blockTimestamp = blockTimestamp;
        output.save();
    }
}

export function createRole(
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
