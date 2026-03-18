import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
    ConfidentialBalance,
    ConfidentialToken,
    ConfidentialTransfer,
    Handle,
    TokenOperator,
} from '../generated/schema';
import {
    AmountDisclosed as AmountDisclosedEvent,
    ConfidentialToken as ConfidentialTokenContract,
    ConfidentialTransfer as ConfidentialTransferEvent,
    OperatorSet as OperatorSetEvent,
} from '../generated/templates/ConfidentialToken/ConfidentialToken';
import { getOrCreateAccount, getOrCreateHandle } from './utils/utils';

// ============ Helpers ============

function bigIntToBytes32(value: BigInt): Bytes {
    let hex = value.toHexString().slice(2);
    while (hex.length < 64) {
        hex = '0' + hex;
    }
    return Bytes.fromHexString('0x' + hex);
}

function getOrUpdateBalance(
    tokenAddress: Address,
    accountAddress: Address,
): ConfidentialBalance | null {
    let contract = ConfidentialTokenContract.bind(tokenAddress);
    let balanceCall = contract.try_balanceOf(accountAddress);
    if (balanceCall.reverted) {
        return null;
    }

    let balanceId = tokenAddress.concat(accountAddress);
    let balance = ConfidentialBalance.load(balanceId);
    if (balance == null) {
        balance = new ConfidentialBalance(balanceId);
        balance.token = tokenAddress;
        balance.account = accountAddress;
    }
    let handleId = bigIntToBytes32(balanceCall.value);
    let handle = getOrCreateHandle(handleId, BigInt.zero(), BigInt.zero());
    balance.balanceHandle = handle.id;
    balance.save();
    return balance;
}

// ============ ConfidentialTransfer Handler ============

export function handleConfidentialTransfer(event: ConfidentialTransferEvent): void {
    let token = ConfidentialToken.load(event.address);
    if (token == null) {
        return;
    }

    let transfer = new ConfidentialTransfer(
        event.transaction.hash.concatI32(event.logIndex.toI32()),
    );
    transfer.token = token.id;

    let amountHandleId = bigIntToBytes32(event.params.amount);
    let amountHandle = Handle.load(amountHandleId);
    if (amountHandle) {
        transfer.amountHandle = amountHandle.id;
    }

    let zeroAddress = Address.zero();

    // From account and balance snapshot
    if (event.params.from != zeroAddress) {
        let fromAccount = getOrCreateAccount(event.params.from);
        transfer.from = fromAccount.id;
        let fromBalance = getOrUpdateBalance(event.address, event.params.from);
        if (fromBalance) {
            transfer.fromBalanceHandle = fromBalance.balanceHandle;
        }
    }

    // To account and balance snapshot
    if (event.params.to != zeroAddress) {
        let toAccount = getOrCreateAccount(event.params.to);
        transfer.to = toAccount.id;
        let toBalance = getOrUpdateBalance(event.address, event.params.to);
        if (toBalance) {
            transfer.toBalanceHandle = toBalance.balanceHandle;
        }
    }

    transfer.blockNumber = event.block.number;
    transfer.blockTimestamp = event.block.timestamp;
    transfer.transactionHash = event.transaction.hash;
    transfer.save();
}

// ============ OperatorSet Handler ============

export function handleOperatorSet(event: OperatorSetEvent): void {
    let token = ConfidentialToken.load(event.address);
    if (token == null) {
        return;
    }

    let holder = getOrCreateAccount(event.params.holder);
    let operator = getOrCreateAccount(event.params.operator);

    let operatorId = event.address.concat(event.params.holder).concat(event.params.operator);
    let tokenOperator = TokenOperator.load(operatorId);
    if (tokenOperator == null) {
        tokenOperator = new TokenOperator(operatorId);
        tokenOperator.token = token.id;
        tokenOperator.holder = holder.id;
        tokenOperator.operator = operator.id;
    }

    tokenOperator.until = event.params.until;
    tokenOperator.blockNumber = event.block.number;
    tokenOperator.blockTimestamp = event.block.timestamp;
    tokenOperator.transactionHash = event.transaction.hash;
    tokenOperator.save();
}

// ============ AmountDisclosed Handler ============

export function handleAmountDisclosed(event: AmountDisclosedEvent): void {
    let handleId = bigIntToBytes32(event.params.encryptedAmount);
    let handle = Handle.load(handleId);
    if (handle != null) {
        handle.plaintext = bigIntToBytes32(event.params.amount);
        handle.save();
    }
}
