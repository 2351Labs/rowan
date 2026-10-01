<script>
  export let config;
  export let onCheckboxChange;
  export let onButtonClick;
</script>

<rowan-table {config}></rowan-table>

<form>
  <rowan-checkbox name="consent" value="yes" on:rowan-change={onCheckboxChange}>
    Accept terms
  </rowan-checkbox>
  <rowan-button type="button" on:rowan-click={onButtonClick}>Save</rowan-button>
</form>