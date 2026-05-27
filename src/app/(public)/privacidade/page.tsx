import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e tratamento de dados pessoais do site AN.',
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="LGPD" title="Política de Privacidade">
        <p className="text-body-s text-smoke">
          Última atualização: {new Date().getFullYear()}
        </p>
      </PageHero>

      <section className="px-6 pb-16 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-prose space-y-8 text-body text-graphite">
            <div>
              <h2 className="mb-3 font-heading text-h2">1. Responsável</h2>
              <p>
                Aurimar Nogueira, pessoa física, domiciliado em Cuiabá, MT, Brasil.
                Email de contato: contato@aurimarnogueira.com.br.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">2. Dados coletados</h2>
              <p>Este site coleta apenas os dados que você fornece voluntariamente:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-body-s">
                <li>Nome e email (formulário de contato)</li>
                <li>Email (download de skills, newsletter)</li>
                <li>Consentimento de newsletter e WhatsApp (checkboxes explícitos)</li>
                <li>Endereço IP anonimizado e user-agent (logs de acesso)</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">3. Finalidade</h2>
              <ul className="list-inside list-disc space-y-1 text-body-s">
                <li>Responder mensagens recebidas via formulário de contato</li>
                <li>Enviar emails de newsletter (somente com consentimento explícito)</li>
                <li>Disponibilizar download de arquivos .skill</li>
                <li>Melhorar a experiência do site via analytics anonimizados</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">4. Base legal</h2>
              <p>
                Consentimento do titular (Art. 7, I da LGPD). Você pode revogar
                seu consentimento a qualquer momento.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">5. Compartilhamento</h2>
              <p>
                Seus dados não são compartilhados com terceiros. Os serviços utilizados
                (Vercel, Resend, Neon) processam dados exclusivamente para operação técnica
                do site e envio de emails.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">6. Retenção</h2>
              <p>
                Dados de contato e subscriber são mantidos enquanto houver relação ativa.
                Ao solicitar exclusão, seus dados são removidos em até 30 dias.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">7. Seus direitos</h2>
              <p>Conforme a LGPD (Lei 13.709/2018), você tem direito a:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-body-s">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar anonimização, bloqueio ou eliminação</li>
                <li>Revogar consentimento</li>
                <li>Solicitar portabilidade dos dados</li>
              </ul>
              <p className="mt-2">
                Para exercer seus direitos, envie email para contato@aurimarnogueira.com.br.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">8. Cookies</h2>
              <p>
                Este site utiliza um cookie funcional (an_email_verified) para lembrar
                que você já informou seu email para download de skills. Validade: 30 dias.
                Não utilizamos cookies de rastreamento ou marketing.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">9. Alterações</h2>
              <p>
                Esta política pode ser atualizada periodicamente. A data da última
                atualização será sempre exibida no topo desta página.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
