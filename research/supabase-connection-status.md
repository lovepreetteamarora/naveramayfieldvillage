# Navera registration integration

Prepared October 27, 2026.

- Shared project: artcnnkhqprbzhfudenh.
- Navera project slug: navera-mayfield-village.
- Domain: naveramayfieldhomes.com.
- Server validates contact fields, form answers and consent; hashes the request IP; limits requests per server instance; and writes through the existing capture-lead gateway.
- The source has been migrated from a static build to a Worker with embedded public assets. The reference visual design is preserved in site/.
- Five automated checks pass, including no success on database failure and rejection of invalid requests.

Activation is pending renewed Supabase account authorization. Existing MCP credentials are expired and a reconnect flow has been started. No migration has been applied and no hosted secrets have been configured. The live website remains on its last known working version, with email preparation, until the new gateway project can be registered and persistence verified.

Next: apply the project-registry migration, configure Navera-only LEAD_API_URL/LEAD_API_TOKEN/LEAD_IP_SALT, build/package/deploy using the existing Sites project ID, and verify a labelled test lead. Never reuse another site's project token. No test lead has been sent yet.
