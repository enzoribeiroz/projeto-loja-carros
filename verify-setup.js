const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = "https://lgsvemxonnztfvpqytlg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3ZlbXhvbm56dGZ2cHF5dGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODkyNTYsImV4cCI6MjA2NTc2NTI1Nn0.kJl3K1AHOemP8MHmHx4b9iDPBOdmXxubwiI9IYr4c5M";

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
    console.log('🔍 VERIFICANDO CONFIGURAÇÃO DO SUPABASE...\n');

    try {
        // 1. Verificar tabelas
        console.log('📋 1. VERIFICANDO TABELAS...');
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['users', 'vehicles', 'vehicle_images', 'vehicle_features', 'favorites', 'contacts', 'seller_info']);

        if (tablesError) {
            console.log('❌ Erro ao verificar tabelas:', tablesError.message);
        } else {
            console.log('✅ Tabelas encontradas:', tables?.length || 0);
            tables?.forEach(table => {
                console.log(`   - ${table.table_name}`);
            });
        }

        // 2. Verificar usuários
        console.log('\n👥 2. VERIFICANDO USUÁRIOS...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('email, is_admin')
            .limit(10);

        if (usersError) {
            console.log('❌ Erro ao verificar usuários:', usersError.message);
        } else {
            console.log('✅ Usuários encontrados:', users?.length || 0);
            users?.forEach(user => {
                console.log(`   - ${user.email} (${user.is_admin ? 'ADMIN' : 'USER'})`);
            });
        }

        // 3. Verificar veículos
        console.log('\n🚗 3. VERIFICANDO VEÍCULOS...');
        const { data: vehicles, error: vehiclesError } = await supabase
            .from('vehicles')
            .select('name, brand, model, is_active')
            .limit(10);

        if (vehiclesError) {
            console.log('❌ Erro ao verificar veículos:', vehiclesError.message);
        } else {
            console.log('✅ Veículos encontrados:', vehicles?.length || 0);
            vehicles?.forEach(vehicle => {
                console.log(`   - ${vehicle.brand} ${vehicle.model} (${vehicle.is_active ? 'ATIVO' : 'INATIVO'})`);
            });
        }

        // 4. Teste de conexão realtime
        console.log('\n🔄 4. TESTANDO REALTIME...');
        const channel = supabase
            .channel('test-verification')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, 
                (payload) => {
                    console.log('✅ Realtime funcionando:', payload.eventType);
                })
            .subscribe();

        setTimeout(() => {
            console.log('✅ Realtime configurado');
            supabase.removeChannel(channel);
        }, 2000);

        // 5. Teste de autenticação
        console.log('\n🔐 5. TESTANDO AUTENTICAÇÃO...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'caio@caio.com',
            password: '6464'
        });

        if (authError) {
            console.log('❌ Erro na autenticação:', authError.message);
        } else {
            console.log('✅ Autenticação funcionando');
            console.log(`   - Usuário: ${authData.user?.email}`);
        }

        console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');

    } catch (error) {
        console.error('❌ Erro durante a verificação:', error.message);
    }
}

verifySetup(); 