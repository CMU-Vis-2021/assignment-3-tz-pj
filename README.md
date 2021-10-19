Tammy Zhou and Priya Jain
Data Visualization - Assignment 3 Write-up

Question: This data consists of people born between 1980 - 1884 birth cohort. We wanted users to be able to see which states most inventors grew up in. What is the breakdown of female and male inventors by state? 

Design Decisions: 

Interactive Choropleth map: We wanted to visualize the data by state. This type of map makes it easy for the user to interact with the data from different states.

Tooltip: The map is color coded with a darker hue representing a state with a higher proportion of inventors. However, the tooltip presents quantitative details on demand.

Bar chart: For each state, a bar chart appears on hover, detailing the breakdown of male and female inventors. The alternative was a pie chart, but we concluded using a bar chart for the inventor count would better relay the information.

Hover : When you hover over a state, it darkens to communicate which state is selected. This just gives confirmation/feedback to the user and makes it more interactive.

State abbreviations: Added state abbreviations so the map is well labelled and adds more information without requiring the user to hover over the state.


Development Process: 
We split up the work by features of the visualization and also worked together on some of the tougher features of the data visualization. The development process was long and full of challenges. We spent many hours working on a dropdown filter feature that would change and update the choropleth map. However, we ran into challenges with the structure of our data file and the actual implementation of this. Specifically, the update function was not updating the map when the dropdown option was selected. 

Due to time constraints, we decided to create a bar graph within the tooltip as the user hovered over each state. Even though this was not changing the choropleth graph, it still was a large investment of time. 

Initially we wanted to explore how parental income levels impacted the number of inventors per state. As we began working in D3, we realized we underestimated the complexity and time required to bring all our ideas to fruition and settled on other aspects.


We both spent roughly 15-20 hours individually, totalling about 40 hours together.

