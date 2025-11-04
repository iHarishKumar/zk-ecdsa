import { ethers } from "ethers";
import { writeFileSync } from 'fs';


/**
 * Recovers the public key from a signature and verifies it against an expected address.
 *
 * Usage: node recoverPubKey.js <message> <expectedAddress> <signature>
 *
 * Example: node recoverPubKey.js "hello" "0xecD0cC6127F01CF483F90cbf123e0FB5c8539A1B" "0x87b4b1f167bc825b1051ca2b8c037b8b51703b851e465b53d3ef73ac4654c6a030cb6ae64b21407fe917ca42649f979fe3f4a6bd3c7e84ab8287183879ed4e2d1b"
 */
async function recoverPubKey() {
  const [message, expectedAddress, signature] = process.argv.slice(2);
  
  // Hash the message (Ethereum signed message prefix)
  const messageHash = ethers.hashMessage(message);
  const messageHashBytes = ethers.getBytes(messageHash);
  
  // Recover the public key
  const publicKey = ethers.SigningKey.recoverPublicKey(messageHashBytes, signature);
  console.log("Public Key:", publicKey);
  
  // Get the address from the public key to verify
  const address = ethers.computeAddress(publicKey);
  console.log("Recovered Address:", address);
  console.log("Expected Address:", expectedAddress);
  console.log("Addresses match:", address.toLowerCase() === expectedAddress.toLowerCase());
  
  // Split the public key into x and y coordinates (removing the 0x04 prefix)
  const pubKeyNoPrefix = publicKey.slice(4);
  const x = "0x" + pubKeyNoPrefix.substring(0, 64);
  const y = "0x" + pubKeyNoPrefix.substring(64);
  
  console.log("\nPublic Key X:", x);
  console.log("Public Key Y:", y);
  
  // Convert message hash to decimal array
  const messageHashHex = '0x' + Buffer.from(messageHashBytes).toString('hex');
  
  // Create Prover.toml content
  const proverToml = `expected_address = "${expectedAddress}"
hashed_message = ${hexToDecimalArray(messageHashHex, 32)}
pub_key_x = ${hexToDecimalArray(x, 32)}
pub_key_y = ${hexToDecimalArray(y, 32)}
signature = ${hexToDecimalArray(signature, 64)}`;
  
  // Write to file
  writeFileSync('Prover.toml', proverToml);
  console.log('\nProver.toml has been created successfully!');
}

  // Convert to decimal arrays for Noir
  function hexToDecimalArray(hexStr, maxLength = null) {
    const bytes = [];
    const hex = hexStr.startsWith('0x') ? hexStr.slice(2) : hexStr;
    const length = maxLength ? Math.min(hex.length, maxLength * 2) : hex.length;
    
    for (let i = 0; i < length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    
    // For signatures, ensure we only return 64 bytes (remove recovery ID if present)
    if (maxLength === 64 && bytes.length > 64) {
      return "[" + bytes.slice(0, 64).join(", ") + "]";
    }
    
    return "[" + bytes.join(", ") + "]";
  }

recoverPubKey().catch(console.error);
