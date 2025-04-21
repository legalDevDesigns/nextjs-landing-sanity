export const structure = (S) => {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Landing Pages')
        .icon(HomeIcon)
        .child(
          S.documentTypeList('landingPage')
            .title('Landing Pages')
        ),
      S.listItem()
        .title('Reusable Feature Cards')
        .icon(PresentationChartLineIcon)
        .child(
          S.documentTypeList('featureCard')
            .title('Reusable Feature Cards')
        ),
      
      // Add a divider
      S.divider(),
      
      // Add the rest of the document types (if any)
      ...S.documentTypeListItems()
        .filter(listItem => 
          !['landingPage', 'featureCard'].includes(
            listItem.getId()
          )
        )
    ])
}

// Import icons used in structure
import { HomeIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline' 