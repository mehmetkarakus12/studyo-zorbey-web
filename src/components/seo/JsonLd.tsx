/**
 * Güvenli JSON-LD render'ı. `data` yalnızca bu kod tabanının kendi ürettiği
 * (kullanıcı girdisi içermeyen) yapılandırılmış nesnelerden gelir, bu yüzden
 * `JSON.stringify` + `dangerouslySetInnerHTML` burada güvenlidir.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
