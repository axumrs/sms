use jsonwebtoken::{DecodingKey, EncodingKey};

use serde::{Deserialize, Serialize};

pub struct Keys {
    pub encoding: EncodingKey,
    pub decoding: DecodingKey,
}

impl Keys {
    pub fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iss: String,
}

impl Claims {
    pub fn new(duration: usize) -> Self {
        let exp = chrono::Utc::now().timestamp() as usize + duration;
        Self {
            sub: "AXUM_SMS_ADMINTRATOR".into(),
            exp,
            iss: "AXUM.EU.ORG".into(),
        }
    }
}

pub fn key(secret: &str) -> Keys {
    Keys::new(secret.as_bytes())
}
pub fn token(claims: &Claims, keys: &EncodingKey) -> String {
    jsonwebtoken::encode(&jsonwebtoken::Header::default(), claims, &keys).unwrap()
}

pub fn validate(token: &str, keys: &DecodingKey) -> Result<Claims, jsonwebtoken::errors::Error> {
    let claims =
        jsonwebtoken::decode::<Claims>(token, &keys, &jsonwebtoken::Validation::default())?.claims;
    Ok(claims)
}

#[cfg(test)]
mod tests {
    use super::*;
    const JWT_SECERT: &str = "gA8qRajn9gYacWxt76qtEm47";
    const JWT_EXP: usize = 3600;

    fn key() -> Keys {
        super::key(JWT_SECERT)
    }

    #[test]
    fn test_token() {
        let claims = &Claims::new(JWT_EXP);
        let token = token(claims, &key().encoding);
        println!("token: {}", token);
    }

    #[test]
    fn test_validate() {
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBWFVNX1NNU19BRE1JTlRSQVRPUiIsImV4cCI6MTc1MjIxMzAxOSwiaXNzIjoiQVhVTS5FVS5PUkcifQ.KTasmYOjAPrIjWXprxkuO9MOo4JXdvaHwgrK2vJgZX4";
        let claims = validate(token, &key().decoding).unwrap();
        println!("claims: {:#?}", claims);
    }
}
