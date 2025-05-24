# Vault Verse - Memory Vault Smart Contract System

![Vault Verse Logo](https://vault.magic.sui/images/logo.png)

## Overview

Vault Verse is a blockchain-based memory vault system built on the Sui network that allows users to create personalized vaults to store memories of transactions and important events. These memories can then be transformed into unique NFTs, creating a bridge between financial transactions and digital collectibles.

## Features

- **Personalized Memory Vaults**: Create and customize your own vault with name, color theme, and personal story
- **Memory Recording**: Record deposit and withdrawal actions with custom notes and ritual descriptions
- **NFT Creation**: Transform your vault memories into unique NFTs
- **Fortune Generation**: Receive personalized fortunes based on your vault activity patterns
- **Vault Transfers**: Transfer ownership of your vault to another address
- **Customization**: Update vault metadata including name, color, and story
- **Memory Visualization**: Create visual representations of specific memories

## Smart Contract Components

The Vault Verse system consists of two primary components:

### 1. Vault Module (`vault.move`)

The core module that implements the memory vault functionality:

- **VaultNFT**: The main object that stores vault metadata and memories
- **Memory**: Data structure for storing individual memory entries
- **VaultSummary**: View object for accessing vault information
- **Memory Management**: Functions to record deposits and withdrawals
- **Vault Customization**: Functions to update vault metadata
- **Fortune Generation**: System to generate personalized fortunes based on vault activity

### 2. NFT Object Module (`nft_object.move`)

Module that enables the creation of NFTs based on vault memories:

- **VaultArtNFT**: NFT object associated with vault memories
- **Art Creation**: Functions to create NFTs based on:
  - General vault information
  - Specific memories
  - Vault fortune

## Usage Examples

### Creating a New Vault

```move
// Create a new personal vault
vault_verse::vault::create_vault(
    b"My Memory Vault",
    b"blue",
    b"A place to store my most treasured financial memories",
    &clock,
    ctx
);
```

### Recording a Memory

```move
// Record a deposit memory
vault_verse::vault::record_deposit(
    &mut my_vault,
    1000,  // amount
    b"First paycheck of the year, invested with gratitude",
    option::none(),  // no multiplier
    &clock,
    ctx
);

// Record a withdrawal memory
vault_verse::vault::record_withdrawal(
    &mut my_vault,
    500,  // amount
    b"Emergency fund for home repairs",
    option::some(2),  // with multiplier
    &clock,
    ctx
);
```

### Creating an NFT from a Memory

```move
// Create an NFT from a specific memory
vault_verse::nft_object::create_memory_art(
    &my_vault,
    0,  // memory index
    b"First Investment",
    b"A visual representation of my first investment",
    b"https://example.com/nft-image.png",
    b"rare",
    b"Vault Verse Creator",
    timestamp,
    ctx
);
```

### Creating a Fortune NFT

```move
// Create an NFT with your vault's fortune
vault_verse::nft_object::create_fortune_art(
    &my_vault,
    b"My Financial Fortune",
    b"https://example.com/fortune-image.png",
    b"legendary",
    b"Fortune Teller",
    timestamp,
    ctx
);
```

## Technical Details

### Architecture

Vault Verse uses a dual-module architecture:

1. **Vault Module**: Handles the core functionality of creating and managing vaults and memories
2. **NFT Object Module**: Provides the capability to create NFTs based on vault data

### Data Flow

The system follows this general flow:
1. User creates a personalized vault
2. User records memories (deposits/withdrawals) with metadata
3. Vault data is used to generate fortunes or create NFTs
4. NFTs can be traded or kept as digital collectibles

### Events

The system emits the following events:
- `VaultCreated`: When a new vault is created
- `MemoryCreated`: When a new memory is recorded
- `VaultTransferred`: When vault ownership changes
- `VaultCustomized`: When vault metadata is updated
- `VaultArtNFTCreated`: When a new NFT is created from vault data

### Security Features

- Owner-only access for vault modifications
- Verified memory indexing
- Safe ownership transfer mechanism

## Installation and Setup

1. Clone the repository
2. Install Sui CLI and dependencies
3. Build the project using `sui move build`
4. Publish the package to the Sui network using `sui client publish`

## License

Licensed under the Apache License, Version 2.0

---

Built with ❤️ for the Sui hackathon

