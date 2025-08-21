export function decodeJWT(token: string): any {
  try {
    // Séparer les parties du JWT (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Token JWT invalide");
    }

    // Décoder la partie payload (index 1)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Ajouter le padding si nécessaire
    const padding = "====".slice(0, (4 - (base64.length % 4)) % 4);
    const base64Padded = base64 + padding;

    // Décoder le base64
    const jsonPayload = decodeURIComponent(
      atob(base64Padded)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur de décodage JWT:", error);
    return null;
  }
}

// Fonction utilitaire pour vérifier si un token est expiré
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp est en secondes, Date.now() est en millisecondes
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

// Fonction pour extraire l'utilisateur du token
export function getUserFromToken(token: string): any {
  try {
    const decoded = decodeJWT(token);
    return {
      username: decoded?.username,
      roles: decoded?.roles || [],
      exp: decoded?.exp,
      iat: decoded?.iat,
    };
  } catch (error) {
    console.error("Erreur extraction utilisateur du token:", error);
    return null;
  }
}
