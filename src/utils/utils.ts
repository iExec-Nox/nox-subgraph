import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Handle, HandleRole } from '../../generated/schema';

export function getOrCreateHandle(handleId: Bytes): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
        handle.operator = '';
        handle.parentHandles = new Array<Bytes>(0);
        handle.childHandles = new Array<Bytes>(0);
        handle.save();
    }
    return handle;
}

export function createOperation(
    operator: string,
    operandIds: Bytes[],
    outputIds: Bytes[],
    txHash: Bytes,
    logIndex: i32,
): void {
    for (let i = 0; i < operandIds.length; i++) {
        getOrCreateHandle(operandIds[i]);
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

export function createPlaintextOperation(
    plaintext: Bytes,
    outputIds: Bytes[],
    txHash: Bytes,
    logIndex: i32,
): void {
    for (let i = 0; i < outputIds.length; i++) {
        let output = Handle.load(outputIds[i]);
        if (output == null) {
            output = new Handle(outputIds[i]);
            output.isPubliclyDecryptable = false;
            output.childHandles = new Array<Bytes>(0);
        }
        output.operator = 'PlaintextToEncrypted';
        output.parentHandles = new Array<Bytes>(0);
        output.plaintext = plaintext;
        output.transactionHash = txHash;
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
