import {
  autocomplete,
  AutocompleteComponents,
  getAlgoliaResults,
} from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { html } from "htm/preact";

const searchClient = algoliasearch(
  "QPV12Z8WQ2",
  "b6eeb321e640da5c99ece06490d5cdf5"
);

type FieldName = "title" | "content" | "tags" | "href" | "date";

type FieldType = string | number;

declare type SearchRecord = Record<FieldName, FieldType>;

type SearchComponent = {
  hit: SearchRecord;
  components: AutocompleteComponents;
};

autocomplete<SearchRecord>({
  container: "#autocomplete",
  placeholder: "Search for blog posts",
  getSources({ query }) {
    return [
      {
        sourceId: "title",
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: "blog-data",
                query,
                params: {
                  hitsPerPage: 5,
                  attributesToSnippet: ["title:10", "content:15"],
                  snippetEllipsisText: "…",
                },
              },
            ],
          });
        },
        templates: {
          item({ item, components }) {
            return html`<${ProductItem}
              hit="${item}"
              components="${components}"
            />`;
          },
        },
      },
    ];
  },
});

function ProductItem({ hit, components }: SearchComponent) {
  const onClick = () => {
    window.location.href = hit.href as string;
  };

  return html`<div className="aa-ItemWrapper">
    <div className="aa-ItemContent" onclick="${onClick}">
      <div className="aa-ItemContentBody">
        <div className="aa-ItemContentTitle">
          <${components.Snippet} hit="${hit}" attribute="title" />
        </div>
        <div className="aa-ItemContentDescription">
          <${components.Snippet} hit="${hit}" attribute="content" />
        </div>
      </div>
    </div>
  </div>`;
}
