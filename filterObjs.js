module.exports = {
  Errors: [
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Sad cat shown\"",
            analyze_wildcard: true
          }
        }
      },
      label: "SadCat"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Delayed Session encountered\"",
            analyze_wildcard: true
          }
        }
      },
      label: "DelayedSession"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Unacceptable\" AND Message:\"time\"",
            analyze_wildcard: true
          }
        }
      },
      label: "UnacceptableTime"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Failed Cloud request\"",
            analyze_wildcard: true
          }
        }
      },
      label: "FailedCloudRequest"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Uncaught exception\"",
            analyze_wildcard: true
          }
        }
      },
      label: "UncaughtException"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Sad cat shown\" AND -Message:\"Delayed Session encountered\" AND -Message:\"Unacceptable\" AND -Message:\"time\" AND -Message:\"Failed Cloud request\" AND -Message:\"Uncaught exception\"",
            analyze_wildcard: true
          }
        }
      },
      label: "other"
    },
  ],
  DelayedSession: [
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"umedia.imaginelearning.net\"",
            analyze_wildcard: true
          }
        }
      },
      label: "umedia"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"sequencer.my.imaginelearning.com\"",
            analyze_wildcard: true
          }
        }
      },
      label: "sequencer"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"manager.my.imaginelearning.com\"",
            analyze_wildcard: true
          }
        }
      },
      label: "manager"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"studentdata.my.imaginelearning.com\"",
            analyze_wildcard: true
          }
        }
      },
      label: "studentdata"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"logger.my.imaginelearning.com\"",
            analyze_wildcard: true
          }
        }
      },
      label: "logger"
    },
    {
      input: {
        query: {
          query_string: {
            query: "-Message:\"umedia.imaginelearning.net\" AND -Message:\"sequencer.my.imaginelearning.com\" AND -Message:\"manager.my.imaginelearning.com\" AND -Message:\"logger.my.imaginelearning.com\" AND -Message:\"studentdata.my.imaginelearning.com\"",
            analyze_wildcard: true
          }
        }
      },
      label: "other"
    }
  ],
  APItime: [
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Manager API round trip time\"",
            analyze_wildcard: true
          }
        }
      },
      label: "ManagerAPI"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Get Next Activity round trip time\"",
            analyze_wildcard: true
          }
        }
      },
      label: "GetNextActivity"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Activity Completed round trip time\"",
            analyze_wildcard: true
          }
        }
      },
      label: "ActivityCompleted"
    },
    {
      input: {
        query: {
          query_string: {
            query: "Message:\"Activity Download Media Time\"",
            analyze_wildcard: true
          }
        }
      },
      label: "DownloadMedia"
    }
  ]

};