// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.kapt) apply false
    alias(libs.plugins.hilt) apply false
}

allprojects {
    tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask> {
        doFirst {
            System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism", "1")
        }
    }
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
