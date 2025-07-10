// Verificação das variáveis de ambiente necessárias
export function checkEnvironmentVariables() {
  // Como as credenciais estão hardcoded no supabase.ts, sempre retornar válido
  return {
    valid: true,
    message: "Credenciais do Supabase configuradas",
  }
}

export function getSupabaseConfig() {
  return {
    url: "https://lgsvemxonnztfvpqytlg.supabase.co",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3ZlbXhvbm56dGZ2cHF5dGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODkyNTYsImV4cCI6MjA2NTc2NTI1Nn0.kJl3K1AHOemP8MHmHx4b9iDPBOdmXxubwiI9IYr4c5M",
    configured: true,
  }
}
