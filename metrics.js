module.exports = {
  actLoaded: {
    id: "1",
    enabled: true,
    type: "count",
    schema: "metric",
    params: {
      customLabel: "Activities Loaded"
    }
  },
  avgLoadTime: {
    id: "1",
    enabled: true,
    type: "avg",
    schema: "metric",
    params: {
      field: "Measurement",
      customLabel: "Avg Load Time (ms)"
    }
  },
  avgMediaThroughput: {
    id: "1",
    enabled: true,
    type: "avg",
    schema: "metric",
    params: {
      field: "Measurement",
      customLabel: "Avg MediaThroughput (Kb/s)"
    }
  },
  error: {
    id: "1",
    enabled: true,
    type: "count",
    schema: "metric",
    params: {
      customLabel: "Errors Logged"
    }
  },
  sitecode: {
    id: "1",
    enabled: true,
    type: "terms",
    schema: "bucket",
    params: {
      field: "SiteCode.raw",
      size: 1000,
      order: "desc",
      orderBy: "1",
      customLabel: "SiteCode"
    }
  },
  uniqueUsername: {
    id: "1",
    enabled: true,
    type: "cardinality",
    schema: "metric",
    params: {
      field: "Username.raw",
      customLabel: "Unique Usernames"
    }
  },
  uniqueDeviceIds: {
    id: "1",
    enabled: true,
    type: "cardinality",
    schema: "metric",
    params: {
      field: "DeviceId",
      customLabel: "Unique DeviceIds"
    }
  },
  uniqueVersions: {
    id: "1",
    enabled: true,
    type: "cardinality",
    schema: "metric",
    params: {
      field: "Version.raw",
      customLabel: "Unique Versions"
    }
  },
  uniqueDeviceModels: {
    id: "1",
    enabled: true,
    type: "cardinality",
    schema: "metric",
    params: {
      field: "DeviceModel.keyword",
      customLabel: "Unique DeviceModels"
    }
  },
  uniqueOperatingSystems: {
    id: "1",
    enabled: true,
    type: "cardinality",
    schema: "metric",
    params: {
      field: "OperatingSystem.keyword",
      customLabel: "Unique OperatingSystems"
    }
  },
  uniquePlatforms: {
    id: "1",
    enabled: true,
    type: "cardinality",
    schema: "metric",
    params: {
      field: "Platform.raw",
      customLabel: "Unique Platforms"
    }
  },
  range: {
    id: "2",
    enabled: true,
    type: "range",
    schema: "bucket",
    params: {
      field: "Measurement",
      ranges: [],
      "customLabel": "Ranges (ms)"
    }
  },
  deviceModel: {
    id: "2",
    enabled: true,
    type: "terms",
    schema: "bucket",
    params: {
      field: "DeviceModel.keyword",
      size: 3000,
      order: "desc",
      orderBy: "1",
      customLabel: "DeviceModel"
    }
  },
  operatingSystem: {
    id: "2",
    enabled: true,
    type: "terms",
    schema: "bucket",
    params: {
      field: "OperatingSystem.keyword",
      size: 3000,
      order: "desc",
      orderBy: "1",
      customLabel: "OperatingSystem"
    }
  },
  version: {
    id: "2",
    enabled: true,
    type: "terms",
    schema: "bucket",
    params: {
      field: "Version.raw",
      size: 3000,
      order: "desc",
      orderBy: "1",
      customLabel: "Version"
    }
  }
};