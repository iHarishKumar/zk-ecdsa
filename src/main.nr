use dep::ecrecover::ecrecover;
use dep::std;
fn main(
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    hashed_message: [u8; 32],
    expected_address: Field,
) -> pub Field {
    let address: Field = ecrecover(pub_key_x, pub_key_y, signature, hashed_message);
    std::println(address);
    assert(address == expected_address, "Address does not match expected address");
    
    address
}
