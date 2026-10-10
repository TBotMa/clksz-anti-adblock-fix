# ClkSz Anti-Adblock Overlay Fix

A site-specific **Violentmonkey userscript (v1.7)** for hiding ClkSz anti-adblock warning overlays while leaving Brave Shields enabled.

**[Install userscript](https://github.com/TBotMa/clksz-anti-adblock-fix/raw/refs/heads/main/clksz-anti-adblock-fix.user.js)** · [View source](clksz-anti-adblock-fix.user.js) · [Raw script](https://raw.githubusercontent.com/TBotMa/clksz-anti-adblock-fix/main/clksz-anti-adblock-fix.user.js)

## Installation

1. Install the **Violentmonkey** browser extension in Brave or another compatible browser.
2. Open the **Install userscript** link above and approve the installation in Violentmonkey. If your browser downloads it instead, open the file through Violentmonkey or copy the source into a new script.
3. Enable the script and visit `https://clksz.com/`.
4. If replacing an earlier version, disable or delete the old script to avoid duplicate execution.

## What it does

- Runs at `document-start` on `clksz.com` and `www.clksz.com`.
- Intercepts creation of some closed Shadow DOM roots, including roots created through temporary iframe realms.
- Finds the anti-adblock dialog by its text and hides the containing full-screen overlay.
- Restores scrolling where the site locks it.
- Does not remove the page's `body` or `html` nodes.

## Testing and limitations

Version **1.7** was tested manually in Brave: the warning and replacement overlay disappeared, Cloudflare Turnstile completed, and the Continue and Get Link steps reached the destination.

This is a workaround, not an official ClkSz component. It modifies DOM methods and may stop working or interfere with scripts if the site changes. It does not guarantee successful verification or navigation in every browser or session.

To troubleshoot, open DevTools Console and look for `[ClkSz fix]` messages. Disable the script and reload if you encounter page instability.

## Educational purpose and legal disclaimer

This project is shared **for educational and research purposes**, including learning about browser userscripts, DOM inspection, Shadow DOM, iframe JavaScript contexts and client-side interface customisation.

It is an independent, unofficial project and is **not affiliated with, endorsed by or sponsored by ClkSz, Brave, Cloudflare or Violentmonkey**.

The script changes how certain elements are displayed in the user's own browser. It is **not a guarantee of access**, does not authorise access to restricted resources, and must not be used to compromise security, evade authentication, impersonate others or access systems or information without permission.

Users are responsible for assessing and complying with the **laws applicable in their jurisdiction**, as well as relevant website terms and policies. Anti-circumvention and computer-misuse rules differ between jurisdictions and factual circumstances. Describing a project as educational does **not** create a legal exemption or make otherwise unlawful conduct lawful.

The code is provided **as is**, without warranty or assurances of legality, compatibility or continued operation. Review the source before installing it. Disable the userscript if it causes unexpected behaviour.

## Version

Current: **v1.7**. The userscript itself is maintained in [`clksz-anti-adblock-fix.user.js`](clksz-anti-adblock-fix.user.js).
