// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module vault_verse::vault;

use std::string::{Self, String};
use sui::clock::{Self, Clock};
use sui::display;
use sui::event;
use sui::package;

/// Errors
const ENotVaultOwner: u64 = 0;

/// Action types for memories
const ACTION_DEPOSIT: u8 = 0;
const ACTION_WITHDRAW: u8 = 1;

/// Capability for contract upgrades
public struct VAULT has drop {}

/// A single memory entry recording an action in the vault
public struct Memory has copy, drop, store {
    /// Timestamp when the memory was created
    timestamp: u64,
    /// Type of action (deposit = 0, withdraw = 1)
    action_type: u8,
    /// Amount of asset involved
    amount: u64,
    /// Optional note or ritual description
    note: String,
    /// Optional multiplier outcome
    multiplier: Option<u64>,
}

/// The main NFT vault object that stores memories and metadata
public struct VaultNFT has key, store {
    id: UID,
    /// Name of the vault
    name: String,
    /// Color theme for the vault
    color: String,
    /// Short story or description
    story: String,
    /// The owner of the vault
    owner: address,
    /// Log of all memories (transactions/events)
    memories: vector<Memory>,
    /// Total amount deposited
    total_deposits: u64,
    /// Total amount withdrawn
    total_withdrawals: u64,
    /// Creation timestamp
    created_at: u64,
}

/// View object for getting vault summary without needing the actual vault
public struct VaultSummary has copy, drop {
    id: ID,
    name: String,
    owner: address,
    memory_count: u64,
    total_deposits: u64,
    total_withdrawals: u64,
    created_at: u64,
}

/// Event emitted when a new memory is created
public struct MemoryCreated has copy, drop {
    vault_id: ID,
    timestamp: u64,
    action_type: u8,
    amount: u64,
    note: String,
    owner: address,
}

/// Event emitted when a vault is created
public struct VaultCreated has copy, drop {
    vault_id: ID,
    owner: address,
    name: String,
    created_at: u64,
}

/// Event emitted when a vault is transferred
public struct VaultTransferred has copy, drop {
    vault_id: ID,
    previous_owner: address,
    new_owner: address,
}

/// Event emitted when a vault is customized
public struct VaultCustomized has copy, drop {
    vault_id: ID,
    name: String,
    color: String,
    story: String,
}

// ==================== Core Functions ====================

fun init(otw: VAULT, ctx: &mut TxContext) {
    // Create Publisher for Display
    let publisher = package::claim(otw, ctx);

    // Set up NFT display
    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"description"),
        string::utf8(b"image_url"),
        string::utf8(b"creator"),
        string::utf8(b"memories"),
        string::utf8(b"total_deposits"),
        string::utf8(b"total_withdrawals"),
    ];

    let values = vector[
        string::utf8(b"{name}"),
        string::utf8(b"{story}"),
        // Default image could be updated to something more specific
        string::utf8(b"https://vault.magic.sui/images/{id}.png"),
        string::utf8(b"Magic Vault System"),
        string::utf8(b"{memories}"),
        string::utf8(b"{total_deposits}"),
        string::utf8(b"{total_withdrawals}"),
    ];

    let mut display = display::new_with_fields<VaultNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}

/// Create a new vault for the sender
public entry fun create_vault(
    name: vector<u8>,
    color: vector<u8>,
    story: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let name_str = string::utf8(name);
    let color_str = string::utf8(color);
    let story_str = string::utf8(story);
    let owner = tx_context::sender(ctx);
    let timestamp = clock::timestamp_ms(clock);

    let vault = VaultNFT {
        id: object::new(ctx),
        name: name_str,
        color: color_str,
        story: story_str,
        owner,
        memories: vector::empty(),
        total_deposits: 0,
        total_withdrawals: 0,
        created_at: timestamp,
    };

    let vault_id = object::id(&vault);

    // Emit event for vault creation
    event::emit(VaultCreated {
        vault_id,
        owner,
        name: name_str,
        created_at: timestamp,
    });

    // Transfer the vault to the sender
    transfer::transfer(vault, owner);
}

/// Record a deposit memory in the vault
public entry fun record_deposit(
    vault: &mut VaultNFT,
    amount: u64,
    note: vector<u8>,
    multiplier: Option<u64>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // Ensure sender is the vault owner
    let sender = tx_context::sender(ctx);
    assert!(sender == vault.owner, ENotVaultOwner);

    let timestamp = clock::timestamp_ms(clock);
    let note_str = string::utf8(note);

    let memory = Memory {
        timestamp,
        action_type: ACTION_DEPOSIT,
        amount,
        note: note_str,
        multiplier,
    };

    // Update vault stats
    vector::push_back(&mut vault.memories, memory);
    vault.total_deposits = vault.total_deposits + amount;

    // Emit event for the new memory
    event::emit(MemoryCreated {
        vault_id: object::id(vault),
        timestamp,
        action_type: ACTION_DEPOSIT,
        amount,
        note: note_str,
        owner: sender,
    });
}

/// Record a withdrawal memory in the vault
public entry fun record_withdrawal(
    vault: &mut VaultNFT,
    amount: u64,
    note: vector<u8>,
    multiplier: Option<u64>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // Ensure sender is the vault owner
    let sender = tx_context::sender(ctx);
    assert!(sender == vault.owner, ENotVaultOwner);

    let timestamp = clock::timestamp_ms(clock);
    let note_str = string::utf8(note);

    let memory = Memory {
        timestamp,
        action_type: ACTION_WITHDRAW,
        amount,
        note: note_str,
        multiplier,
    };

    // Update vault stats
    vector::push_back(&mut vault.memories, memory);
    vault.total_withdrawals = vault.total_withdrawals + amount;

    // Emit event for the new memory
    event::emit(MemoryCreated {
        vault_id: object::id(vault),
        timestamp,
        action_type: ACTION_WITHDRAW,
        amount,
        note: note_str,
        owner: sender,
    });
}

/// Customize the vault metadata
public entry fun customize_vault(
    vault: &mut VaultNFT,
    name: vector<u8>,
    color: vector<u8>,
    story: vector<u8>,
    ctx: &mut TxContext,
) {
    // Ensure sender is the vault owner
    let sender = tx_context::sender(ctx);
    assert!(sender == vault.owner, ENotVaultOwner);

    let name_str = string::utf8(name);
    let color_str = string::utf8(color);
    let story_str = string::utf8(story);

    vault.name = name_str;
    vault.color = color_str;
    vault.story = story_str;

    // Emit event for customization
    event::emit(VaultCustomized {
        vault_id: object::id(vault),
        name: name_str,
        color: color_str,
        story: story_str,
    });
}

/// Transfer the vault to a new owner
public entry fun transfer_vault(vault: &mut VaultNFT, new_owner: address, ctx: &mut TxContext) {
    // Ensure sender is the vault owner
    let sender = tx_context::sender(ctx);
    assert!(sender == vault.owner, ENotVaultOwner);

    let previous_owner = vault.owner;
    vault.owner = new_owner;

    // Emit event for vault transfer
    event::emit(VaultTransferred {
        vault_id: object::id(vault),
        previous_owner,
        new_owner,
    });
}

/// Get a summary of the vault
public fun get_vault_summary(vault: &VaultNFT): VaultSummary {
    VaultSummary {
        id: object::id(vault),
        name: vault.name,
        owner: vault.owner,
        memory_count: vector::length(&vault.memories),
        total_deposits: vault.total_deposits,
        total_withdrawals: vault.total_withdrawals,
        created_at: vault.created_at,
    }
}

/// Get the owner of a vault from summary
public fun get_vault_summary_owner(summary: &VaultSummary): address {
    summary.owner
}

/// Get the name from vault summary
public fun get_vault_summary_name(summary: &VaultSummary): String {
    summary.name
}

/// Get memory count from vault summary
public fun get_vault_summary_memory_count(summary: &VaultSummary): u64 {
    summary.memory_count
}

/// Generate a vault fortune based on the memories
public fun generate_vault_fortune(vault: &VaultNFT): String {
    let memory_count = vector::length(&vault.memories);

    if (memory_count == 0) {
        return string::utf8(b"Your vault awaits its first memory. New beginnings bring prosperity.")
    };

    let mut deposit_ratio: u64 = 0;
    if (vault.total_deposits > 0) {
        deposit_ratio =
            (vault.total_deposits * 100) / (vault.total_deposits + vault.total_withdrawals);
    };

    if (deposit_ratio > 80) {
        return string::utf8(
                b"Your vault grows steadily. Abundance flows to those who save with intention.",
            )
    } else if (deposit_ratio > 50) {
        return string::utf8(
                b"Balance in giving and receiving. Your vault reflects a harmonious journey.",
            )
    } else if (deposit_ratio > 20) {
        return string::utf8(
                b"The flow of withdrawal brings new opportunities. Remember to replenish.",
            )
    } else {
        return string::utf8(b"Your vault tells a story of release. Freedom comes from letting go.")
    }
}

/// Get all memories from a vault
public fun get_all_memories(vault: &VaultNFT): vector<Memory> {
    vault.memories
}

/// Get the most recent memory from a vault
public fun get_latest_memory(vault: &VaultNFT): Option<Memory> {
    let len = vector::length(&vault.memories);
    if (len == 0) {
        return option::none()
    };

    let memory = *vector::borrow(&vault.memories, len - 1);
    option::some(memory)
}

// Helper function to convert a memory to a string representation (JSON-like format)
public fun memory_to_string(memory: &Memory): String {
    let mut result = string::utf8(b"{");

    // Add timestamp
    string::append(&mut result, string::utf8(b"\"timestamp\":"));
    string::append(&mut result, to_string(memory.timestamp));
    string::append(&mut result, string::utf8(b","));

    // Add action type
    string::append(&mut result, string::utf8(b"\"action\":"));
    if (memory.action_type == ACTION_DEPOSIT) {
        string::append(&mut result, string::utf8(b"\"deposit\""));
    } else {
        string::append(&mut result, string::utf8(b"\"withdraw\""));
    };
    string::append(&mut result, string::utf8(b","));

    // Add amount
    string::append(&mut result, string::utf8(b"\"amount\":"));
    string::append(&mut result, to_string(memory.amount));
    string::append(&mut result, string::utf8(b","));

    // Add note
    string::append(&mut result, string::utf8(b"\"note\":\""));
    string::append(&mut result, memory.note);
    string::append(&mut result, string::utf8(b"\""));

    // Add multiplier if exists
    if (option::is_some(&memory.multiplier)) {
        string::append(&mut result, string::utf8(b","));
        string::append(&mut result, string::utf8(b"\"multiplier\":"));
        string::append(&mut result, to_string(*option::borrow(&memory.multiplier)));
    };

    string::append(&mut result, string::utf8(b"}"));
    result
}

// Helper function to convert u64 to string
fun to_string(mut value: u64): String {
    if (value == 0) {
        return string::utf8(b"0")
    };

    let mut buffer = vector::empty<u8>();
    while (value > 0) {
        vector::push_back(&mut buffer, ((value % 10) as u8) + 48);
        value = value / 10;
    };

    vector::reverse(&mut buffer);
    string::utf8(buffer)
}
