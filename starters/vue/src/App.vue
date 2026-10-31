<script setup>
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/kpi-card";
import "@rowan-ui/core/trend-chart";
import "@rowan-ui/core/table";

import { onMounted, ref } from "vue";

import { LABELS, SERIES, TABLE_CONFIG } from "./sample.js";

const openOrders = ref(null);
const onTime = ref(null);
const exceptions = ref(null);
const chart = ref(null);
const table = ref(null);

onMounted(() => {
  assignMetric(openOrders.value, 42, 4);
  assignMetric(onTime.value, "96%", 2);
  assignMetric(exceptions.value, 3, -1);
  chart.value.labels = LABELS;
  chart.value.series = SERIES;
  table.value.config = TABLE_CONFIG;
});

function assignMetric(card, value, delta) {
  card.value = value;
  card.delta = delta;
  card.deltaLabel = "vs last week";
}
</script>

<template>
  <main class="page">
    <header>
      <h1>Week of 27 Oct</h1>
      <p class="lede">A small Rowan dashboard. The figures are local sample data.</p>
    </header>
    <section class="kpis" aria-label="Key figures">
      <rowan-kpi-card ref="openOrders" label="Open orders" tone="info"></rowan-kpi-card>
      <rowan-kpi-card ref="onTime" label="On time" tone="success"></rowan-kpi-card>
      <rowan-kpi-card ref="exceptions" label="Exceptions" tone="warning"></rowan-kpi-card>
    </section>
    <section class="panel">
      <h2>Orders</h2>
      <rowan-trend-chart
        ref="chart"
        label="Orders this week"
        description="Orders booked each day. Sample data, not a live feed."
      ></rowan-trend-chart>
    </section>
    <section class="panel">
      <h2>Recent orders</h2>
      <rowan-table ref="table" caption="Recent orders"></rowan-table>
    </section>
  </main>
</template>

<style src="./styles.css"></style>
