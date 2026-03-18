import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { ConfidentialToken as ConfidentialTokenContract } from '../../generated/NoxCompute/ConfidentialToken';
import { Account, ConfidentialToken, Handle, HandleRole } from '../../generated/schema';
import { ConfidentialToken as ConfidentialTokenTemplate } from '../../generated/templates';

export function getOrCreateHandle(
    handleId: Bytes,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
): Handle {
    let handle = Handle.load(handleId);
    if (handle == null) {
        handle = new Handle(handleId);
        handle.isPubliclyDecryptable = false;
        handle.operator = '';
        handle.parentHandles = new Array<Bytes>(0);
        handle.childHandles = new Array<Bytes>(0);
        handle.blockNumber = blockNumber;
        handle.blockTimestamp = blockTimestamp;
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
        getOrCreateHandle(operandIds[i], blockNumber, blockTimestamp);
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

export function createPlaintextOperation(
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
        output.operator = 'PlaintextToEncrypted';
        output.parentHandles = new Array<Bytes>(0);
        output.plaintext = plaintext;
        output.transactionHash = txHash;
        output.blockNumber = blockNumber;
        output.blockTimestamp = blockTimestamp;
        output.save();
    }
}

export function getOrCreateAccount(address: Bytes): Account {
    let account = Account.load(address);
    if (account == null) {
        account = new Account(address);
        account.save();
    }
    return account;
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
    let acc = getOrCreateAccount(account);
    const roleId = txHash.concatI32(logIndex);
    const handleRole = new HandleRole(roleId);
    handleRole.handle = handle.id;
    handleRole.account = acc.id;
    handleRole.role = role;
    handleRole.grantedBy = grantedBy;
    handleRole.blockNumber = blockNumber;
    handleRole.blockTimestamp = blockTimestamp;
    handleRole.transactionHash = txHash;
    handleRole.save();
}

// ============ Confidential Token Helpers ============

export function getOrCreateConfidentialToken(tokenAddress: Address): ConfidentialToken | null {
    let token = ConfidentialToken.load(tokenAddress);
    if (token != null) {
        return token;
    }

    let contract = ConfidentialTokenContract.bind(tokenAddress);
    let nameCall = contract.try_name();
    if (nameCall.reverted) {
        return null;
    }
    let symbolCall = contract.try_symbol();
    if (symbolCall.reverted) {
        return null;
    }
    let decimalsCall = contract.try_decimals();
    if (decimalsCall.reverted) {
        return null;
    }

    token = new ConfidentialToken(tokenAddress);
    token.name = nameCall.value;
    token.symbol = symbolCall.value;
    token.decimals = decimalsCall.value;

    let underlyingCall = contract.try_underlying();
    token.isWrapped = !underlyingCall.reverted;

    token.save();

    ConfidentialTokenTemplate.create(tokenAddress);

    return token;
}
