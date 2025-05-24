// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module vault_verse::nft_object;

use std::ascii;
use std::string::{Self, String};
use sui::display;
use sui::event;
use sui::package;
use sui::url::{Self, Url};
use vault_verse::vault::{Self, VaultNFT, get_vault_summary, get_vault_summary_owner};

/// Type that marks the capability to mint NFTs
public struct NFT_OBJECT has drop {}

/// An example NFT that can be associated with vault information
public struct VaultArtNFT has key, store {
    id: UID,
    /// Name for the token
    name: String,
    /// Description of the token
    description: String,
    /// URL for the token image
    url: Url,
    /// ID of the associated vault
    vault_id: address,
    /// Artist or creator of the NFT
    creator: String,
    /// Rarity or tier of the NFT
    rarity: String,
    /// Creation timestamp
    created_at: u64,
}

/// Event emitted when a new VaultArtNFT is created
public struct VaultArtNFTCreated has copy, drop {
    /// ID of the NFT
    nft_id: address,
    /// ID of the associated vault
    vault_id: address,
    /// Name of the NFT
    name: String,
    /// Creator of the NFT
    creator: String,
}

/// One-time witness for the module
fun init(otw: NFT_OBJECT, ctx: &mut TxContext) {
    // Create Publisher for Display
    let publisher = package::claim(otw, ctx);

    // Set up NFT display
    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"description"),
        string::utf8(b"image_url"),
        string::utf8(b"creator"),
        string::utf8(b"vault_id"),
        string::utf8(b"rarity"),
        string::utf8(b"created_at"),
    ];

    let values = vector[
        string::utf8(b"{name}"),
        string::utf8(b"{description}"),
        string::utf8(b"{url}"),
        string::utf8(b"{creator}"),
        string::utf8(b"{vault_id}"),
        string::utf8(b"{rarity}"),
        string::utf8(b"{created_at}"),
    ];

    let mut display = display::new_with_fields<VaultArtNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}

/// Create a new VaultArtNFT associated with a vault
/// Can only be called by the vault owner
public entry fun create_vault_art(
    vault: &VaultNFT,
    name: vector<u8>,
    description: vector<u8>,
    url_string: vector<u8>,
    rarity: vector<u8>,
    creator: vector<u8>,
    timestamp: u64,
    ctx: &mut TxContext,
) {
    // Ensure the caller is the vault owner
    let sender = tx_context::sender(ctx);
    let summary = get_vault_summary(vault);
    assert!(sender == get_vault_summary_owner(&summary), 0); // Not vault owner

    let name_str = string::utf8(name);
    let description_str = string::utf8(description);
    // Convert URL string directly to ASCII
    let url_ascii = ascii::string(url_string);
    let rarity_str = string::utf8(rarity);
    let creator_str = string::utf8(creator);
    let vault_id = object::id_address(vault);

    let nft = VaultArtNFT {
        id: object::new(ctx),
        name: name_str,
        description: description_str,
        url: url::new_unsafe(url_ascii),
        vault_id,
        creator: creator_str,
        rarity: rarity_str,
        created_at: timestamp,
    };

    let nft_id = object::id_address(&nft);

    // Emit event
    event::emit(VaultArtNFTCreated {
        nft_id,
        vault_id,
        name: name_str,
        creator: creator_str,
    });

    // Transfer the NFT to the sender
    transfer::transfer(nft, sender);
}

/// Create an NFT based on vault memory history
/// This demonstrates creating visual representations of memories
public entry fun create_memory_art(
    vault: &VaultNFT,
    memory_index: u64,
    name: vector<u8>,
    description: vector<u8>,
    url_string: vector<u8>,
    rarity: vector<u8>,
    creator: vector<u8>,
    timestamp: u64,
    ctx: &mut TxContext,
) {
    // Ensure the caller is the vault owner
    let sender = tx_context::sender(ctx);
    let summary = get_vault_summary(vault);
    assert!(sender == get_vault_summary_owner(&summary), 0); // Not vault owner

    // Validate memory index (this could be made more robust)
    let all_memories = vault::get_all_memories(vault);
    assert!(memory_index < vector::length(&all_memories), 1); // Invalid memory index

    // Get memory and include it in the description
    let memory = *vector::borrow(&all_memories, memory_index);
    let memory_string = vault::memory_to_string(&memory);
    let mut description_str = string::utf8(description);
    string::append(&mut description_str, string::utf8(b" Memory: "));
    string::append(&mut description_str, memory_string);

    let name_str = string::utf8(name);
    // Convert URL string directly to ASCII
    let url_ascii = ascii::string(url_string);
    let rarity_str = string::utf8(rarity);
    let creator_str = string::utf8(creator);
    let vault_id = object::id_address(vault);

    let nft = VaultArtNFT {
        id: object::new(ctx),
        name: name_str,
        description: description_str,
        url: url::new_unsafe(url_ascii),
        vault_id,
        creator: creator_str,
        rarity: rarity_str,
        created_at: timestamp,
    };

    let nft_id = object::id_address(&nft);

    // Emit event
    event::emit(VaultArtNFTCreated {
        nft_id,
        vault_id,
        name: name_str,
        creator: creator_str,
    });

    // Transfer the NFT to the sender
    transfer::transfer(nft, sender);
}

/// Create a visual representation of the vault's fortune
public entry fun create_fortune_art(
    vault: &VaultNFT,
    name: vector<u8>,
    url_string: vector<u8>,
    rarity: vector<u8>,
    creator: vector<u8>,
    timestamp: u64,
    ctx: &mut TxContext,
) {
    // Ensure the caller is the vault owner
    let sender = tx_context::sender(ctx);
    let summary = get_vault_summary(vault);
    assert!(sender == get_vault_summary_owner(&summary), 0); // Not vault owner

    // Generate fortune from vault history
    let fortune = vault::generate_vault_fortune(vault);

    let name_str = string::utf8(name);
    // Convert URL string directly to ASCII
    let url_ascii = ascii::string(url_string);
    let rarity_str = string::utf8(rarity);
    let creator_str = string::utf8(creator);
    let vault_id = object::id_address(vault);

    // Create description with fortune
    let mut description_str = string::utf8(b"Vault Fortune: ");
    string::append(&mut description_str, fortune);

    let nft = VaultArtNFT {
        id: object::new(ctx),
        name: name_str,
        description: description_str,
        url: url::new_unsafe(url_ascii),
        vault_id,
        creator: creator_str,
        rarity: rarity_str,
        created_at: timestamp,
    };

    let nft_id = object::id_address(&nft);

    // Emit event
    event::emit(VaultArtNFTCreated {
        nft_id,
        vault_id,
        name: name_str,
        creator: creator_str,
    });

    // Transfer the NFT to the sender
    transfer::transfer(nft, sender);
}

/// Get the URL of the NFT
public fun get_url(nft: &VaultArtNFT): &Url {
    &nft.url
}

/// Get the vault ID associated with the NFT
public fun get_vault_id(nft: &VaultArtNFT): address {
    nft.vault_id
}

/// Get the NFT's creation timestamp
public fun get_created_at(nft: &VaultArtNFT): u64 {
    nft.created_at
}

/// Get the NFT's name
public fun get_name(nft: &VaultArtNFT): &String {
    &nft.name
}

/// Get the NFT's description
public fun get_description(nft: &VaultArtNFT): &String {
    &nft.description
}
