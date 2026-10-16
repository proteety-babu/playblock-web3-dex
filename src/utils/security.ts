// Security utilities for Web3 wallet and smart contract analysis

export function validateSeedPhrase(phrase: string): boolean {
  if (!phrase) return false;
  const words = phrase.trim().split(/\s+/);
  return words.length === 12 || words.length === 15 || words.length === 18 || words.length === 24;
}

export function validatePrivateKey(key: string): boolean {
  if (!key) return false;
  const cleanKey = key.startsWith("0x") ? key.substring(2) : key;
  return /^[0-9a-fA-F]{64}$/.test(cleanKey);
}

export function validateAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Simple XOR and Base64 encryption for client-side sandbox wallet storage
export function encryptWalletData(text: string, pin: string): string {
  try {
    const combined = `${pin}:${text}`;
    let result = "";
    for (let i = 0; i < combined.length; i++) {
      const charCode = combined.charCodeAt(i) ^ pin.charCodeAt(i % pin.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(unescape(encodeURIComponent(result)));
  } catch (e) {
    return btoa(text);
  }
}

export function decryptWalletData(encrypted: string, pin: string): string | null {
  try {
    const raw = decodeURIComponent(escape(atob(encrypted)));
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      const charCode = raw.charCodeAt(i) ^ pin.charCodeAt(i % pin.length);
      result += String.fromCharCode(charCode);
    }
    if (result.startsWith(`${pin}:`)) {
      return result.substring(pin.length + 1);
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Static pattern vulnerability scanner for instant local contract analysis
export function staticAnalyzeSolidity(code: string) {
  const issues: {
    title: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";
    description: string;
    lineMatch?: string;
  }[] = [];

  // Check 1: Reentrancy (call.value / raw call before state change)
  if (/\.call\{value:|\.call\.value\(/.test(code)) {
    if (!/nonReentrant|ReentrancyGuard/.test(code)) {
      issues.push({
        title: "Potential Reentrancy Vulnerability (SWC-107)",
        severity: "CRITICAL",
        description: "External ether transfers detected without 'nonReentrant' mutex guard or state updates after external calls.",
      });
    }
  }

  // Check 2: tx.origin authorization
  if (/tx\.origin\s*==/.test(code)) {
    issues.push({
      title: "Vulnerable tx.origin Authentication (SWC-115)",
      severity: "HIGH",
      description: "Using tx.origin for authentication is vulnerable to phishing and proxy forwarder attacks. Use msg.sender instead.",
    });
  }

  // Check 3: Selfdestruct / delegatecall
  if (/selfdestruct\(|suicide\(/.test(code)) {
    issues.push({
      title: "Dangerous selfdestruct Instruction (SWC-106)",
      severity: "HIGH",
      description: "Selfdestruct can result in permanent contract destruction or balance draining if not strictly guarded.",
    });
  }

  // Check 4: Unchecked transfer return value
  if (/\.transfer\(|\.send\(/.test(code) && !/require\(/.test(code)) {
    issues.push({
      title: "Unchecked Return Value / Deprecated Transfer (SWC-104)",
      severity: "MEDIUM",
      description: "Using raw transfer() or send() can fail if recipient contract gas stipend exceeds 2300. Use SafeERC20 or call{value}() with require.",
    });
  }

  // Check 5: Floating pragma
  if (/pragma solidity \^/.test(code)) {
    issues.push({
      title: "Floating Pragma Version (SWC-103)",
      severity: "LOW",
      description: "Contracts should be locked with a fixed compiler pragma (e.g. pragma solidity 0.8.20;) in production.",
    });
  }

  // Check 6: Hidden Honeypot / Blacklist / Unlimited Mint
  if (/_burnFromOwner|blacklist\[|maxWallet|tradingEnabled = false/.test(code)) {
    issues.push({
      title: "Honeypot / Blacklist Risk Detected",
      severity: "CRITICAL",
      description: "Detected central blacklisting, arbitrary balance confiscation, or transfer locks commonly associated with honeypots.",
    });
  }

  return issues;
}
