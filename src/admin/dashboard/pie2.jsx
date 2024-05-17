import { ResponsivePie } from "@nivo/pie";

import { Box, useTheme } from "@mui/material";

const data = [
  {
    id: "React",
    label: "React",
    value: 272,
    color: "hsl(107, 70%, 50%)",
  },
  {
    id: "stylus",
    label: "stylus",
    value: 543,
    color: "hsl(64, 70%, 50%)",
  },
  {
    id: "sass",
    label: "sass",
    value: 401,
    color: "hsl(41, 70%, 50%)",
  },
  {
    id: "haskell",
    label: "haskell",
    value: 434,
    color: "hsl(172, 70%, 50%)",
  },
  {
    id: "nue",
    label: "nue",
    value: 333,
    color: "hsl(219, 70%, 50%)",
  },
];

const Pie = ({ isDashbord = false }) => {
  const theme = useTheme();
  return (
    <Box sx={{ height: isDashbord ? "200px" : "300px" }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.6}
        padAngle={2}
        colors={{ scheme: 'red_blue' }}
        borderColor="#000000"
        arcLinkLabelsTextColor="#000000"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#000000"
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 67,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
    </Box>
  );
};

export default Pie;
