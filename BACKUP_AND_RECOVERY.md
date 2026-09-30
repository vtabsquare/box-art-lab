# Backup and Recovery Procedures

## Data Architecture
Box Art Lab relies on a decoupled architecture for data storage, minimizing infrastructure overhead while maximizing reliability:

1. **Lead & Customer Data**: Stored in Google Sheets via Google Apps Script (CRM).
2. **Proposals**: Generated as base64 PDF strings and emailed to the user via Brevo API. No PDFs are permanently stored on our servers.
3. **Session State**: Held in the user's browser via `localStorage` (ephemeral).

## Backup Procedures

### Google Sheets CRM Data
Because lead data is stored in Google Workspace, backups are inherently managed by Google's infrastructure.
- **Version History**: Google Sheets automatically tracks version history.
- **Manual Backups**: To take a manual backup, open the CRM Google Sheet and navigate to `File > Download > Comma Separated Values (.csv)` or `Microsoft Excel (.xlsx)`. It is recommended to perform this weekly.

### Codebase & Configurations
- **Code repository**: Hosted on GitHub. Git inherently acts as the version control and backup mechanism for all application logic.
- **Environment Variables**: Make sure to securely back up your `VITE_GOOGLE_CLIENT_ID` and `BREVO_API_KEY` in a password manager (e.g., 1Password or Bitwarden). These are NOT stored in the code repository.

## Recovery Procedures

### Restoring Lead Data
If the CRM Google Sheet is accidentally corrupted or deleted:
1. Go to Google Drive.
2. If deleted, check the "Trash" folder and click "Restore".
3. If corrupted, open the Sheet, click `File > Version history > See version history`, select a known good timestamp, and click "Restore this version".

### Recovering a Lost Proposal
Because proposals are generated on the fly and emailed directly to the client:
- Box Art Lab does not retain historical PDFs in a database to save on storage costs.
- If a client loses a proposal, they simply need to re-enter the studio using their email address. Their details will be remembered, and they can re-generate and re-send the identical proposal in seconds. 
- You (the administrator) can also retrieve quotes by checking the Sent folder of the email address authenticated with Brevo.

## Incident Response
If the application goes down (e.g., Netlify outage):
- Wait for Netlify status to resolve (check https://netlifystatus.com/).
- Code can be re-deployed instantly to an alternative provider (Vercel, Cloudflare Pages) using the same GitHub repository and environment variables, ensuring high availability.
