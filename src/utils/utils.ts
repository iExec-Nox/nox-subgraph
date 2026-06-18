import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Handle, HandleRole } from '../../generated/schema';

export function getOrCreateHandle(
    handleId: Bytes,
    operator: string,
    parentHandles: Bytes[],
    blockNumber: BigInt,
    blockTimestamp: BigInt,
    txHash: Bytes,
    plaintext: Bytes | null = null,
): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
        handle.operator = operator;
        handle.parentHandles = parentHandles;
        handle.childHandles = new Array<Bytes>(0);
        handle.blockNumber = blockNumber;
        handle.blockTimestamp = blockTimestamp;
        handle.transactionHash = txHash;
        if (plaintext !== null) {
            handle.plaintext = plaintext;
        }
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
        getOrCreateHandle(
            operandIds[i],
            '',
            new Array<Bytes>(0),
            blockNumber,
            blockTimestamp,
            txHash,
        );
    }

    for (let i = 0; i < outputIds.length; i++) {
        getOrCreateHandle(outputIds[i], operator, operandIds, blockNumber, blockTimestamp, txHash);
    }

    for (let i = 0; i < operandIds.length; i++) {
        const parent = Handle.load(operandIds[i]);
        if (parent != null) {
            const children = parent.childHandles;
            for (let j = 0; j < outputIds.length; j++) {
                children.push(outputIds[j]);
            }
            parent.childHandles = children;
            parent.save();
        }
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
