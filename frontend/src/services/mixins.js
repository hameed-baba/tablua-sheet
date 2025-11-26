const mixins = {
  methods: {
    mobileNumberRegEx() {
      return /^([+]234|234|0){1}[7-9]{1}[0-1]{1}[0-9]{8}$/;
    },
  },
};

export default mixins;
