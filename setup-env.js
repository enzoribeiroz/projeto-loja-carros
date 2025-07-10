const fs = require('fs');
const path = require('path');

// Configurações do Supabase
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lgsvemxonnztfvpqytlg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3ZlbXhvbm56dGZ2cHF5dGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODkyNTYsImV4cCI6MjA2NTc2NTI1Nn0.kJl3K1AHOemP8MHmHx4b9iDPBOdmXxubwiI9IYr4c5M

# Opcional: Para funcionalidades avançadas
# SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
`;

const envPath = path.join(__dirname, '.env.local');

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env.local criado com sucesso!');
    console.log('📁 Localização:', envPath);
    console.log('🔧 Variáveis configuradas:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('\n🚀 Agora você pode executar o projeto!');
} catch (error) {
    console.error('❌ Erro ao criar .env.local:', error.message);
} 