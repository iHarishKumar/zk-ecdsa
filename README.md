# Zero Knowledge ECDSA Signature Verification with Noir

[![Noir](https://img.shields.io/badge/Built%20with-Noir-000000)](https://noir-lang.org/)
[![zkSNARKs](https://img.shields.io/badge/Cryptography-zkSNARKs-blue)](https://z.cash/technology/zksnarks/)
[![Ethereum](https://img.shields.io/badge/Blockchain-Ethereum-3C3C3D)](https://ethereum.org/)

> **Keywords**: zkSNARK, ECDSA, Zero-Knowledge Proofs, Cryptography, Blockchain, Ethereum, Signature Verification, Privacy, Noir, zk-ECDSA

A zero-knowledge proof implementation for ECDSA signature verification using Noir. This project demonstrates how to generate and verify zero-knowledge proofs for ECDSA signature validation, allowing you to prove knowledge of a valid signature without revealing the actual signature or private key.

## Overview

This project implements a zkSNARK circuit using Noir that verifies ECDSA signatures in a privacy-preserving way. The circuit takes a message, public key, and signature as private inputs and outputs whether the signature is valid. The key features include:

- Zero-knowledge proof generation for ECDSA signature verification
- Proof of valid signature without revealing the actual signature
- Integration with Ethereum-compatible signatures
- Tools for generating and verifying proofs

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [Noir](https://noir-lang.org/) (Follow installation instructions from the official documentation)
- [Nargo](https://noir-lang.org/getting_started/nargo/nargo_installation) (Noir's package manager)
- [Barretenberg](https://barretenberg.aztec.network/docs/getting_started/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zk-ecdsa
   ```

2. Install Noir dependencies:
   ```bash
   nargo check
   ```

## Project Structure
```
- src - Contains the Noir circuit code
  - main.nr - Main circuit implementation
- recoverPubKey.js - Script to generate inputs for the proof
- Prover.toml - Input values for the proof
- Nargo.toml - Project configuration for Noir
- generate_inputs.sh - Helper script to generate inputs
```

## Usage

### 1. Install Dependencies

First, install the required Node.js packages:

```bash
npm install
```

### 2. Generate Inputs

Run the following command to generate the necessary inputs for the proof:

```bash
 node recoverPubKey.js <message> <expectedAddress> <signature>
```

This will create/update the `Prover.toml` file with the required values including the hashed message, public key coordinates, and signature.

To generate the signature, use the following command

```bash
cast wallet sign "<MESSAGE>" --account <ACCOUNT_NAME>
```

Replace `<MESSAGE>` with the message you want to sign and `<ACCOUNT_NAME>` with the name of the account you want to sign with.

To create account with private key, use the following command

```bash
cast wallet import <ACCOUNT_NAME> --private-key <PRIVATE_KEY>
```

### 3. Execute the Circuit

Run the circuit with the generated inputs to test the verification:

```bash
nargo execute
```

This will execute the circuit with the provided inputs and show whether the signature verification passes.

### 4. Generate Zero-Knowledge Proof

To generate a zkSNARK proof that the signature is valid:

```bash
bb prove -b ./target/zk_ecdsa.json -w ./target/zk_ecdsa.gz --write_vk -o target
```

This will create a proof file in the `proofs` directory. The proof can be shared with verifiers without revealing the actual signature or private key.

### 5. Verify the Proof

To verify the generated proof:

```bash
bb verify -k ./target/vk -p ./target/proof
```

This will verify that the proof is valid and that the prover knows a valid signature for the given message and public key, without revealing the signature itself.

## Zero-Knowledge Proof Details

The zkSNARK proof provides the following guarantees:

1. **Privacy**: The proof doesn't reveal the actual signature or any private inputs
2. **Completeness**: If the signature is valid, an honest prover can always generate a valid proof
3. **Soundness**: It's computationally infeasible to create a valid proof for an invalid signature
4. **Succinctness**: The proof is small in size and can be verified quickly

## Understanding the Implementation

The circuit implements ECDSA signature verification in a zero-knowledge context. The main components are:

1. **Signature Verification**: The circuit takes private inputs (message, public key, and signature) and verifies the signature's validity without revealing these inputs.

2. **Zero-Knowledge Components**:
   - The prover demonstrates knowledge of a valid signature without revealing it
   - The proof shows that the signature verification would pass, but doesn't leak any information about the signature itself
   - The public inputs (if any) are hashed into the proof for verification

3. **Input Generation**: The `recoverPubKey.js` script handles:
   - Hashing the message using the same method as Ethereum (`ethers.hashMessage`)
   - Extracting the public key coordinates from the signature and message
   - Formatting all values for the Noir circuit

### Verifying on Different Machines

The generated proofs are verifiable by anyone with the verification key. To verify a proof on a different machine:

1. Copy the `proofs/proof` file
2. Copy the `Prover.toml` file
3. Run `bb verify -k ./target/vk -p ./target/proof`

## Security Considerations

- Keep your private keys secure
- The proof doesn't reveal the signature, but the public key and message hash are part of the proof
- Always verify the proof on the verifier's side before accepting it as valid

## Troubleshooting

### Common Issues

1. **Signature Length Mismatch**: Ensure the signature is 64 bytes (remove the recovery ID if present)
2. **Input Format**: All inputs must be in the correct format as specified in `Prover.toml`
3. **Noir Version**: Make sure you're using a compatible version of Noir and Nargo

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Noir](https://noir-lang.org/) for the zero-knowledge proof framework
- [Ethereum](https://ethereum.org/) for the ECDSA implementation reference

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
