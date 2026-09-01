import assert from "node:assert/strict";
import { test } from "node:test";

import {
  homepageStructuredData,
  serializeJsonLd,
} from "../../lib/homepage-structured-data";

const graph = homepageStructuredData["@graph"];
type GraphNode = (typeof graph)[number];

function nodeOfType<Type extends GraphNode["@type"]>(type: Type) {
  return graph.find(
    (node): node is Extract<GraphNode, { "@type": Type }> =>
      node["@type"] === type,
  );
}

test("homepage graph includes linked business, site, page, and software nodes", () => {
  const organization = nodeOfType("Organization");
  const website = nodeOfType("WebSite");
  const webpage = nodeOfType("WebPage");
  const software = nodeOfType("SoftwareApplication");

  assert.ok(organization);
  assert.ok(website);
  assert.ok(webpage);
  assert.ok(software);
  assert.deepEqual(website.publisher, { "@id": organization["@id"] });
  assert.deepEqual(webpage.isPartOf, { "@id": website["@id"] });
  assert.deepEqual(webpage.about, { "@id": organization["@id"] });
  assert.deepEqual(webpage.mainEntity, { "@id": software["@id"] });
  assert.deepEqual(software.provider, { "@id": organization["@id"] });
  assert.deepEqual(software.mainEntityOfPage, { "@id": webpage["@id"] });
});

test("organization schema uses a crawlable image object for the business logo", () => {
  const organization = nodeOfType("Organization");

  assert.ok(organization && "logo" in organization);
  assert.equal(organization.logo["@type"], "ImageObject");
  assert.match(organization.logo.contentUrl, /^https?:\/\//);
  assert.ok(organization.logo.width >= 112);
  assert.ok(organization.logo.height >= 112);
});

test("JSON-LD serialization escapes HTML-opening characters", () => {
  const serialized = serializeJsonLd({ value: "</script><script>" });

  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized, '{"value":"\\u003c/script>\\u003cscript>"}');
});
