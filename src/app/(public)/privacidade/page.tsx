import type { Metadata } from 'next';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';

export const metadata: Metadata = {
  title: 'Politica de Privacidade',
  description: 'Politica de privacidade e tratamento de dados pessoais do site AN.',
};

export default function PrivacidadePage() {
  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">LGPD</Label>
          <h1 className="font-heading text-display-m">Politica de Privacidade</h1>
          <p className="mt-4 text-body-s text-smoke">
            Ultima atualizacao: {new Date().getFullYear()}
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-prose space-y-8 text-body text-graphite">
            <div>
              <h2 className="mb-3 font-heading text-h2">1. Responsavel</h2>
              <p>
                Aurimar Nogueira, pessoa fisica, domiciliado em Cuiaba, MT, Brasil.
                Email de contato: contato@aurimarnogueira.com.br.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">2. Dados coletados</h2>
              <p>Este site coleta apenas os dados que voce fornece voluntariamente:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-body-s">
                <li>Nome e email (formulario de contato)</li>
                <li>Email (download de skills, newsletter)</li>
                <li>Consentimento de newsletter e WhatsApp (checkboxes explicitos)</li>
                <li>Endereco IP anonimizado e user-agent (logs de acesso)</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">3. Finalidade</h2>
              <ul className="list-inside list-disc space-y-1 text-body-s">
                <li>Responder mensagens recebidas via formulario de contato</li>
                <li>Enviar emails de newsletter (somente com consentimento explicito)</li>
                <li>Disponibilizar download de arquivos .skill</li>
                <li>Melhorar a experiencia do site via analytics anonimizados</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">4. Base legal</h2>
              <p>
                Consentimento do titular (Art. 7, I da LGPD). Voce pode revogar
                seu consentimento a qualquer momento.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">5. Compartilhamento</h2>
              <p>
                Seus dados nao sao compartilhados com terceiros. Os servicos utilizados
                (Vercel, Resend, Neon) processam dados exclusivamente para operacao tecnica
                do site e envio de emails.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">6. Retencao</h2>
              <p>
                Dados de contato e subscriber sao mantidos enquanto houver relacao ativa.
                Ao solicitar exclusao, seus dados sao removidos em ate 30 dias.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">7. Seus direitos</h2>
              <p>Conforme a LGPD (Lei 13.709/2018), voce tem direito a:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-body-s">
                <li>Confirmar a existencia de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar anonimizacao, bloqueio ou eliminacao</li>
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
                que voce ja informou seu email para download de skills. Validade: 30 dias.
                Nao utilizamos cookies de rastreamento ou marketing.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-h2">9. Alteracoes</h2>
              <p>
                Esta politica pode ser atualizada periodicamente. A data da ultima
                atualizacao sera sempre exibida no topo desta pagina.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
