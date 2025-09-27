import { LineChart, XAxis, YAxis, Line, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    count: {
        label: "Clicks",
        color: "#e85d04",
    },
} satisfies ChartConfig

interface LocationProps {
    clicksData: Array<{
        city: string;
        country: string;
        device: string;
        created_at: string;
    }>;
}

interface CityData {
    city: string;
    count: number;
}

export default function Location({ clicksData }: LocationProps) {
    if (!clicksData || clicksData.length === 0) {
        return (
            <div className="w-full h-[300px]">
                <Card className="bg-white/5 border-white/20">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Location Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-48 text-gray-400">
                            <div className="text-center">
                                <p>📍</p>
                                <p className="mt-2 text-sm">No location data available</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const cityCount = clicksData.reduce((acc: Record<string, number>, item) => {
        const city = item.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    const cities: CityData[] = Object.entries(cityCount)
        .map(([city, count]) => ({
            city,
            count: count as number,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <div>
            <Card className="bg-white/5 border-white/20">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="w-full">
                        <LineChart
                            data={cities}
                            margin={{
                                top: 20,
                                left: 20,
                                right: 20,
                                bottom: 20,
                            }}
                        >
                            <XAxis
                                dataKey="city"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + '...' : value}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        hideLabel={false}
                                        labelFormatter={(value) => `City: ${value}`}
                                        formatter={(value, name) => [
                                            `${value} `,
                                            'Clicks'
                                        ]}
                                    />
                                }
                            />

                            <Line
                                dataKey="count"
                                type="monotone"
                                stroke="#e85d04"
                                strokeWidth={3}
                                dot={{
                                    fill: '#e85d04',
                                    strokeWidth: 2,
                                    stroke: '#ffffff',
                                    r: 4
                                }}
                                activeDot={{
                                    r: 6,
                                    fill: '#e85d04',
                                    stroke: '#ffffff',
                                    strokeWidth: 2
                                }}
                            />
                        </LineChart>
                    </ChartContainer>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-400 text-sm">Top Location</p>
                            <p className="text-white font-semibold">
                                {cities[0]?.city || 'N/A'}
                            </p>
                            <p className="text-[#e85d04] text-sm">
                                {cities[0]?.count || 0} clicks
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-400 text-sm">Total Cities</p>
                            <p className="text-white font-semibold">
                                {Object.keys(cityCount).length}
                            </p>
                            <p className="text-[#e85d04] text-sm">
                                {clicksData.length} total clicks
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
