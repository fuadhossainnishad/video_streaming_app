// presentation/Channel/components/BarChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthlyData } from '@/shared/types/channel.types';

interface BarChartProps {
    data: MonthlyData[];
    year: string;
}

export default function BarChart({ data, year }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));
    const chartHeight = 150;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>View Chart</Text>
                <View style={styles.yearBadge}>
                    <Text style={styles.yearText}>{year}</Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
                {/* Y-axis labels */}
                <View style={styles.yAxis}>
                    <Text style={styles.axisLabel}>15k</Text>
                    <Text style={styles.axisLabel}>10k</Text>
                    <Text style={styles.axisLabel}>05k</Text>
                    <Text style={styles.axisLabel}>00k</Text>
                </View>

                {/* Bars */}
                <View style={styles.barsContainer}>
                    <View style={styles.bars}>
                        {data.map((item, index) => {
                            const barHeight = (item.value / maxValue) * chartHeight;
                            return (
                                <View key={index} style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: barHeight || 10 },
                                        ]}
                                    />
                                </View>
                            );
                        })}
                    </View>

                    {/* X-axis labels */}
                    <View style={styles.xAxis}>
                        {data.map((item, index) => (
                            <Text key={index} style={styles.monthLabel}>
                                {item.month}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    yearBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    yearText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    dropdownIcon: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    chartContainer: {
        flexDirection: 'row',
        height: 180,
    },
    yAxis: {
        width: 30,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    axisLabel: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'right',
    },
    barsContainer: {
        flex: 1,
        marginLeft: 8,
    },
    bars: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
        paddingHorizontal: 4,
    },
    barWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: '100%',
        backgroundColor: '#9BD71B',
        borderRadius: 4,
        minHeight: 10,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 4,
    },
    monthLabel: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
        flex: 1,
    },
});