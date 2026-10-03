export function validatePassword(password: String): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }

    let digit = false;
    let lower = false;
    let upper = false;
    for (const ch of password) {
        if (ch >= '0' && ch <= '9') {
            digit = true;
        } else if (ch >= 'a' && ch <= 'z') {
            lower = true;
        } else if (ch >= 'A' && ch <= 'Z') {
            upper = true;
        }
    }

    if (!digit) {
        errors.push("Password must include at least 1 digit");
    }
    if (!lower) {
        errors.push("Password must include at least 1 lowercase character");
    }
    if (!upper) {
        errors.push("Password must include at least 1 uppercase character");
    }

    return errors;
}