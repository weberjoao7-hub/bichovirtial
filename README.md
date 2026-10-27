# Bicho Virtual

Jogo mobile-first de bichinho virtual, publicado como site estático, sem servidor nem dependências de execução.

**Jogar:** https://weberjoao7-hub.github.io/bichovirtial/jogar-v2.html

## Estado atual — V2.8 (27/10/2026)

- Gato, coelho e urso usam arte pixel HD original com transparência.
- Animações por espécie e estado: respirar, felicidade, fome, doença, sono, comer, brincar, banho, cuidados e alongamento. A arte é incorporada em SVGs independentes com estados controlados por fragmento da URL.
- Ovo pixel art específico para cada espécie, com versão rachada antes do nascimento.
- Ações, crescimento, moedas, minijogo e conquistas; progresso salvo no localStorage do navegador.
- Interface principal em uma única tela móvel, com modais para adoção, alimentação, minijogo e ajuda.

## Desenvolvimento e verificação

Abra index.html ou jogar-v2.html em um servidor estático. Ambos devem permanecer idênticos. Execute node tests/smoke.cjs para validar os três animais, estados do ovo, sintaxe, animações e integridade dos arquivos de arte. O workflow de qualidade executa esses testes nos commits.

**Limitações conhecidas:** as animações usam transformações em etapas sobre o desenho original, e não um conjunto de quadros redesenhados à mão; testes manuais em diferentes aparelhos reais ainda são necessários. O progresso fica no navegador/dispositivo e não é sincronizado entre aparelhos.

## Histórico recente

- **V2.8:** ovos pixel art originais, movimento animado por estado para três espécies, ação de acordar, bloqueio de brincadeira/alimentação durante o sono e verificação automatizada.
- **V2.7:** arte pixel HD na adoção e no jogo, melhorias na posição dos animais e equilíbrio do desgaste.
