<template>
    <div class="stepper-container">
        <div class="stepper">
            <div v-for="(step, index) in steps" :key="index" class="step-item" :class="{
                active: currentStep === index + 1,
                completed: currentStep > index + 1,
            }" @click="onStepClick(index + 1)">
                <div class="step-indicator">
                    <div class="step-circle">
                        <i v-if="currentStep > index + 1" class="fa fa-check"></i>
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div class="step-label">{{ step }}</div>
                </div>
                <div v-if="index < steps.length - 1" class="step-connector"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    steps: {
        type: Array,
        required: true,
    },
    currentStep: {
        type: Number,
        required: true,
        default: 1,
    },
    allowClickNavigation: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['step-click']);

const onStepClick = (stepNumber) => {
    if (props.allowClickNavigation && stepNumber < props.currentStep) {
        emit('step-click', stepNumber);
    }
};
</script>

<style scoped>
.stepper-container {
    margin-bottom: 2rem;
    padding: 1.5rem 0;
}

.stepper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
}

.step-item {
    flex: 1;
    display: flex;
    align-items: flex-start;
    position: relative;
}

.step-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 2;
    cursor: default;
}

.step-item.completed .step-indicator,
.step-item.active .step-indicator {
    cursor: pointer;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e5e7eb;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 2px solid #e5e7eb;
}

.step-item.active .step-circle {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.step-item.completed .step-circle {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
}

.step-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    text-align: center;
    white-space: nowrap;
    transition: color 0.3s ease;
}

.step-item.active .step-label {
    color: #667eea;
    font-weight: 600;
}

.step-item.completed .step-label {
    color: #10b981;
}

.step-connector {
    flex: 1;
    height: 2px;
    background-color: #e5e7eb;
    margin-top: 20px;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    transition: background-color 0.3s ease;
}

.step-item.completed .step-connector {
    background-color: #10b981;
}

@media (max-width: 768px) {
    .stepper {
        flex-direction: column;
        gap: 1rem;
    }

    .step-item {
        flex-direction: row;
        width: 100%;
    }

    .step-indicator {
        flex-direction: row;
        gap: 0.75rem;
    }

    .step-connector {
        display: none;
    }

    .step-label {
        white-space: normal;
        text-align: left;
    }
}
</style>
