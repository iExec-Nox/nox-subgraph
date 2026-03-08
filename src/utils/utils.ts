import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Handle, HandleRole, Operation } from '../../generated/schema';

export function getOrCreateHandle(handleId: Bytes): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
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

    const operationId = txHash.concatI32(logIndex);
    const operation = new Operation(operationId);
    operation.operator = operator;
    operation.operands = operandIds;
    operation.transactionHash = txHash;
    operation.save();

    for (let i = 0; i < outputIds.length; i++) {
        let output = Handle.load(outputIds[i]);
        if (output == null) {
            output = new Handle(outputIds[i]);
            output.isPubliclyDecryptable = false;
        }
        output.operation = operationId;
        output.save();
    }
}

export function createPlaintextOperation(
    plaintext: Bytes,
    outputIds: Bytes[],
    txHash: Bytes,
    logIndex: i32,
): void {
    const operationId = txHash.concatI32(logIndex);
    const operation = new Operation(operationId);
    operation.operator = 'PlaintextToEncrypted';
    operation.operands = new Array<Bytes>(0);
    operation.plaintext = plaintext;
    operation.transactionHash = txHash;
    operation.save();

    for (let i = 0; i < outputIds.length; i++) {
        let output = Handle.load(outputIds[i]);
        if (output == null) {
            output = new Handle(outputIds[i]);
            output.isPubliclyDecryptable = false;
        }
        output.operation = operationId;
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
